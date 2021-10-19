import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {FormModel, UiVocabulary} from '../../../../../lib/domain/dynamic-form-model';
import * as uikit from 'uikit';


@Component({
  selector: 'app-service-landing-page',
  templateUrl: 'overview.component.html',
  // styleUrls: ['../../landing-page.component.css']
})
export class OverviewComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() model: FormModel[] = null;
  @Input() vocabularies: Map<string, UiVocabulary[]>;

  slide = 0;
  benefitSlide = 0;

  slideMobile = 0;
  benefitSlideMobile = 0;

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

  getVocabularyName(field: string, name: string): string {
    let vocType;
    for (let i = 0; i < this.model.length; i++) {
      for (let j = 0; j < this.model[i].fields.length; j++) {
        if (this.model[i].fields[j].field.name === field && this.model[i].fields[j].field.type === 'vocabulary') {
          vocType = this.model[i].fields[j].field.form.vocabulary;
          for (let k = 0; k < this.vocabularies[vocType].length; k++) {
            if (this.vocabularies[vocType][k].id === name) {
              return (this.vocabularies[vocType][k].name);
            }
          }
        }
      }
    }
  }

  dragSlide(id: string) {
    if (id === 'slideShow')
      this.slide = uikit.getComponent(document.querySelector('[uk-slideshow]'), 'slideshow').index;
    else
      this.benefitSlide = uikit.getComponent(document.querySelector('[uk-slideshow]'), 'slideshow').index;
  }

  showSlide(id: string, index: number) {
    uikit.slideshow('#' + id).show(index);
    // console.log(UIkit.getComponent(document.querySelector('[uk-slideshow]'), 'slideshow').index);
    if (id === 'slideShow') {
      this.slide = index;
    }
    else {
      this.benefitSlide = index;
    }
  }

  dragSlideMobile(id: string) {
    if (id === 'slideShowMobile')
      this.slideMobile = uikit.getComponent(document.querySelector('[uk-slideshow]'), 'slideshow').index;
    else
      this.benefitSlideMobile = uikit.getComponent(document.querySelector('[uk-slideshow]'), 'slideshow').index;
  }

  showSlideMobile(id: string, index: number) {
    uikit.slideshow('#' + id).show(index);
    // console.log(UIkit.getComponent(document.querySelector('[uk-slideshow]'), 'slideshow').index);
    if (id === 'slideShowMobile') {
      this.slideMobile = index;
    }
    else {
      this.benefitSlideMobile = index;
    }

  }

}
