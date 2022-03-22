import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JoinComponent } from './apps/join/join.component';
import { InsuRequestComponent } from './apps/insu-request/insu-request.component';

const routes: Routes = [
  {
    path :'',
    redirectTo:'/join',
    pathMatch :'full'
  },
  {
    path:'join',
    component : JoinComponent
  },
  {
    path:'insuRequest',
    component : InsuRequestComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
