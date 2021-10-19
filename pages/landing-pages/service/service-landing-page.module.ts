import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ServiceLandingPageRouting} from './service-landing-page.routing';
import {ServiceLandingPageComponent} from './service-landing-page.component';
import {OverviewComponent} from './overview/overview.component';
import {PricingComponent} from './pricing/pricing.component';
import {ResourcesAndSupportComponent} from './resourcesAndSupport/resourcesAndSupport.component';
import {MiscellaneousComponent} from './miscellaneous/miscellaneous.component';
import {ReusableComponentsModule} from '../../../../lib/shared/reusablecomponents/reusable-components.module';

@NgModule({
  declarations: [
    ServiceLandingPageComponent,
    OverviewComponent,
    PricingComponent,
    ResourcesAndSupportComponent,
    MiscellaneousComponent
  ],
  imports: [
    CommonModule,
    ReusableComponentsModule,
    ServiceLandingPageRouting
  ],
})

export class ServiceLandingPageModule {}
