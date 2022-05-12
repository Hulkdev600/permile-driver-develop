import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JoinComponent } from './apps/join/join.component';
import { InsuRequestComponent } from './apps/insu-request/insu-request.component';
import { RedirectGuard } from './shared/guard/redirect.guard';
import { InsuInformationComponent } from './apps/insu-information/insu-information.component';

const routes: Routes = [
  {
    path :'',
    redirectTo:'join/insurance-information',
    pathMatch :'full'
  },
  {
    path:'join/:page',
    component : JoinComponent,
  },
  {
    path:'joindev/:page',
    component : JoinComponent,
  },
  {
    path:'insuRequest',
    component : InsuRequestComponent
  },
  {
    path:'insurance-information',
    component : InsuInformationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
