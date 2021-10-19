import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-service-landing-page-misc',
  templateUrl: 'miscellaneous.component.html',
  // styleUrls: ['../../landing-page.component.css']
})
export class MiscellaneousComponent implements OnInit {

  @Input() form: FormGroup;

  ngOnInit() {
  }

  getServiceField(field: string) {
    return this.form.get('service.' + field) as FormControl;
  }

  getExtrasField(field: string) {
    return this.form.get('extras.' + field) as FormControl;
  }

  navigateTo(url: string) {
    window.open(url, "_blank");
  }

}
