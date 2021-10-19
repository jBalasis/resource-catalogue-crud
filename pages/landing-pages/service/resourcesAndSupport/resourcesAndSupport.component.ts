import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-service-landing-page-resources-and-support',
  templateUrl: 'resourcesAndSupport.component.html',
  // styleUrls: ['../../landing-page.component.css']
})
export class ResourcesAndSupportComponent implements OnInit {

  @Input() form: FormGroup;

  ngOnInit() {
  }

  getServiceArray(field: string) {
    return this.form.get('service.' + field) as FormArray;
  }

  getServiceField(field: string) {
    return this.form.get('service.' + field) as FormControl;
  }

  getExtrasArray(field: string) {
    return this.form.get('extras.' + field) as FormArray;
  }

  getExtrasField(field: string) {
    return this.form.get('extras.' + field) as FormControl;
  }

  goto(url: string) {
    window.open(url, '_blank');
  }

}
