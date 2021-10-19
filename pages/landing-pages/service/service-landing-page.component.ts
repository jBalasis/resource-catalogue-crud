import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {Provider, Vocabulary} from 'src/lib/domain/eic-model';
import {AuthenticationService} from 'src/lib/services/authentication.service';
import {NavigationService} from 'src/lib/services/navigation.service';
import {ResourceService} from 'src/lib/services/resource.service';
import {UserService} from 'src/lib/services/user.service';
import {ServiceProviderService} from 'src/lib/services/service-provider.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {zip} from 'rxjs/internal/observable/zip';
import {EmailService} from 'src/lib/services/email.service';
import {environment} from 'src/environments/environment';
import {MatomoTracker} from 'ngx-matomo';
import {FormControlService} from 'src/lib/pages/provider-resources/dynamic-service-form/form-control.service';
import {Fields, FormModel, UiVocabulary} from 'src/lib/domain/dynamic-form-model';
import {PremiumSortPipe} from 'src/lib/shared/pipes/premium-sort.pipe';

@Component({
  selector: 'app-service-landing-page',
  templateUrl: './service-static-landing-page.component.html',
  // styleUrls: ['../landing-page.component.css']
})
export class ServiceLandingPageComponent implements OnInit, OnDestroy {

  public projectName = environment.projectName;
  serviceORresource = environment.serviceORresource;
  public errorMessage: string;
  public serviceId;
  vocabularies: Map<string, UiVocabulary[]>;
  model: FormModel[] = null;
  form: FormGroup = this.fb.group({service: this.fb.group({}), extras: this.fb.group({})}, Validators.required);
  id: string;
  loading = true;
  premiumSort = new PremiumSortPipe();

  private sub: Subscription;
  path: string;
  myProviders:  Provider[] = [];
  canAddOrEditService = false;

  showForm = false;
  places: Vocabulary[] = null;

  constructor(public route: ActivatedRoute,
              public router: NavigationService,
              public authenticationService: AuthenticationService,
              public resourceService: ResourceService,
              public userService: UserService,
              private providerService: ServiceProviderService,
              private formService: FormControlService,
              private fb: FormBuilder,
              private matomoTracker: MatomoTracker,
              public emailService: EmailService) {
  }

  ngOnInit() {
    this.loading = true;

    this.sub = this.route.params.subscribe(params => {
      zip(
        this.formService.getFormModel(),
        this.formService.getDynamicService(params['id']),
        this.formService.getUiVocabularies(),
      ).subscribe(suc => {
          this.model = <FormModel[]>suc[0];
          this.vocabularies = <Map<string, UiVocabulary[]>>suc[2];
          this.initializations();
          ResourceService.removeNulls(suc[1]['service']);
          ResourceService.removeNulls(suc[1]['extras']);
          this.prepareForm(suc[1]);
          this.form.patchValue(suc[1]);
        },
        err => {
          if (err.status === 404) {
            this.router.go('/404');
          }
          this.errorMessage = 'An error occurred while retrieving data for this service. ' + err.error;
        },
        () => {
          this.loading = false;
          if (this.authenticationService.getIsLoggedIn()) {
            this.matomoTracker.trackEvent('Recommendations', this.authenticationService.getUserEmail() + ' ' + this.serviceId, 'visit', 1);
          }
        });
      if (this.authenticationService.getIsLoggedIn()) {
        this.resourceService.getMyServiceProviders().subscribe(
          res => this.myProviders = res,
          er => console.log(er),
          () => this.canAddOrEditService = this.myProviders.some(p => p.id === 'openaire')
        );
      }
      this.id = params['id'];
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  timeOut(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  onOutletLoaded(component) {
    if (this.loading){
      this.timeOut(300).then(() => this.onOutletLoaded(component));
      return;
    } else {
      component.form = this.form;
      component.model = this.model;
      component.vocabularies = this.vocabularies;
    }
    if(window.location.toString().includes('overview')) {
      this.path = 'overview';
    } else if (window.location.toString().includes('pricing')) {
      this.path = 'pricing';
    } else if (window.location.toString().includes('resourcesAndSupport')) {
      this.path = 'resourcesAndSupport';
    } else if (window.location.toString().includes('miscellaneous')) {
      this.path = 'miscellaneous';
    }

    return;
  }

  initializations() {
    /** Create form **/
    let tmpForm: any = {};
    tmpForm['service'] = this.formService.toFormGroup(this.model, true);
    tmpForm['extras'] = this.formService.toFormGroup(this.model, false);
    this.form = this.fb.group(tmpForm);

    /** Initialize and sort vocabulary arrays **/
    // let voc: Vocabulary[] = this.vocabularies['Subcategory'].concat(this.vocabularies['Scientific subdomain']);
    // this.subVocabularies = this.groupByKey(voc, 'parentId');
    for (const [key, value] of Object.entries(this.vocabularies)) {
      this.premiumSort.transform(this.vocabularies[key], ['English', 'Europe', 'Worldwide']);
    }
  }

  prepareForm(form: Object) {
    for (let key in form) {
      for (let formElementKey in form[key]) {
        if (form[key].hasOwnProperty(formElementKey)) {
          if (Array.isArray(form[key][formElementKey])) {
            // console.log(form[key][formElementKey]);
            // console.log(formElementKey);
            let formFieldData = this.getModelData(this.model, formElementKey);
            let i = 1;
            if (formFieldData.field.type === 'composite') { // In order for the fields to be enabled
              this.popComposite(key, formElementKey);  // remove it first
              i = 0;  // increase the loops
            }
            let count = 0;
            for (i; i < form[key][formElementKey].length; i++) {
              if (formFieldData.field.type === 'composite') {
                this.pushComposite(key, formElementKey, formFieldData.subFieldGroups);
                // for (let formSubElementKey in form[key][formElementKey]) { // Special case when composite contains array
                for (let formSubElementName in form[key][formElementKey][count]) {
                  if(form[key][formElementKey][count].hasOwnProperty(formSubElementName)) {
                    if(Array.isArray(form[key][formElementKey][count][formSubElementName])) {
                      // console.log('Key: ' + key + ' formElementKey: ' + formElementKey + ' count: ' + count + ' formSubElementName: ' + formSubElementName);
                      const control = <FormArray>this.form.get([key,formElementKey,count,formSubElementName]);
                      // console.log(control);
                      let required = false;
                      for (let j = 0; j < formFieldData.subFieldGroups.length; j++) {
                        if (formFieldData.subFieldGroups[j].field.name === formSubElementName) {
                          required = formFieldData.subFieldGroups[j].field.form.mandatory;
                        }
                      }
                      for (let j = 0; j < form[key][formElementKey][count][formSubElementName].length - 1; j++) {
                        control.push(required ? new FormControl('', Validators.required) : new FormControl(''));
                      }
                    }
                  }
                }
                // }
                count++;
              } else {
                this.push(key, formElementKey, formFieldData.field.form.mandatory);
              }
            }
          }
        }
      }
    }
  }

  push(group: string, field: string, required: boolean) {
    let tmpArr = this.form.get(group).get(field) as FormArray;
    tmpArr.push(required ? new FormControl('', Validators.required) : new FormControl(''));
  }

  pushComposite(group: string, field: string, subFields: Fields[]) {
    const formGroup: any = {};
    subFields.forEach(subField => {
      if (subField.field.multiplicity) {
        formGroup[subField.field.name] = subField.field.form.mandatory ?
          new FormArray([new FormControl('', Validators.required)])
          : new FormArray([new FormControl('')]);
      } else {
        formGroup[subField.field.name] = subField.field.form.mandatory ? new FormControl('', Validators.required)
          : new FormControl('');
      }
    });
    let tmpArr = this.form.get(group).get(field) as FormArray;
    tmpArr.push(new FormGroup(formGroup));
  }

  popComposite(group: string, field: string) {
    let tmpArr = this.form.get(group).get(field) as FormArray;
    tmpArr.removeAt(0);
  }

  getModelData(model: FormModel[], name: string): Fields {
    for (let i = 0; i < model.length; i++) {
      for (let j = 0; j < model[i].fields.length; j++) {
        if (model[i].fields[j].field.name === name) {
          return model[i].fields[j];
        }
      }
    }
  }

  goto(url: string) {
    window.open(url, '_blank');
  }

}
