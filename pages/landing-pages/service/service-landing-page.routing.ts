import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ServiceLandingPageComponent} from './service-landing-page.component';
import {OverviewComponent} from './overview/overview.component';
import {PricingComponent} from './pricing/pricing.component';
import {ResourcesAndSupportComponent} from './resourcesAndSupport/resourcesAndSupport.component';
import {MiscellaneousComponent} from './miscellaneous/miscellaneous.component';

const serviceLandingPageRoutes: Routes = [
  {
    path: ':id',
    component: ServiceLandingPageComponent,
    data: {
      breadcrumb: 'Service'
    },
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        component: OverviewComponent,
      },
      {
        path: 'pricing',
        component: PricingComponent,
      },
      {
        path: 'resourcesAndSupport',
        component: ResourcesAndSupportComponent,
      },
      {
        path: 'miscellaneous',
        component: MiscellaneousComponent,
      }
    ],
    runGuardsAndResolvers: 'always'
  }
]

@NgModule({
  imports: [RouterModule.forChild(serviceLandingPageRoutes)],
  exports: [RouterModule]
})

export class ServiceLandingPageRouting {}
