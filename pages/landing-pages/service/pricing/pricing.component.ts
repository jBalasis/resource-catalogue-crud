import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-service-landing-page-pricing',
  templateUrl: 'pricing.component.html',
  // styleUrls: ['../../landing-page.component.css']
})
export class PricingComponent implements OnInit {

  @Input() form: FormGroup;

  ngOnInit() {
  }

  getExtrasArray(field: string) {
    return this.form.get('extras.' + field) as FormArray;
  }

  goto(url: string) {
    window.open(url, '_blank')
  }

}
