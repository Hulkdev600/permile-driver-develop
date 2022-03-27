import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { JoinComponent } from './apps/join/join.component';
import { InsuRequestComponent } from './apps/insu-request/insu-request.component';
import { InsuranceInformationComponent } from './pages/join/insurance-information/insurance-information.component';
import { UserFormComponent } from './pages/join/user-form/user-form.component';
import { ConfirmComponent } from './pages/join/confirm/confirm.component';
import { EssentialContentComponent } from './modals/join/insurance-information/essential-content/essential-content.component';
import { GuaranteeContentComponent } from './modals/join/insurance-information/guarantee-content/guarantee-content.component';
import { PremiumContentComponent } from './modals/join/insurance-information/premium-content/premium-content.component';
import { PayoutsLimitContentComponent } from './modals/join/insurance-information/payouts-limit-content/payouts-limit-content.component';
import { ClaimGuideContentComponent } from './modals/join/insurance-information/claim-guide-content/claim-guide-content.component';
import { HiddenSocialNumberPipe } from './shared/pipe/hidden-social-number.pipe';



@NgModule({
  declarations: [
    AppComponent,
    JoinComponent,
    InsuRequestComponent,
    InsuranceInformationComponent,
    UserFormComponent,
    ConfirmComponent,
    EssentialContentComponent,
    GuaranteeContentComponent,
    PremiumContentComponent,
    PayoutsLimitContentComponent,
    ClaimGuideContentComponent,
    HiddenSocialNumberPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
