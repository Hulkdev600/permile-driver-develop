import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoticesComponent } from './sections/notices/notices.component';
import { JoinInformationComponent } from './sections/join-information/join-information.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { JoinComponent } from './apps/join/join.component';
import { InsuRequestComponent } from './apps/insu-request/insu-request.component';
import { InsuranceInformationComponent } from './pages/join/insurance-information/insurance-information.component';
import { UserFormComponent } from './pages/join/user-form/user-form.component';
import { ConfirmComponent } from './pages/join/confirm/confirm.component';

@NgModule({
  declarations: [
    AppComponent,
    NoticesComponent,
    JoinInformationComponent,
    JoinComponent,
    InsuRequestComponent,
    InsuranceInformationComponent,
    UserFormComponent,
    ConfirmComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
