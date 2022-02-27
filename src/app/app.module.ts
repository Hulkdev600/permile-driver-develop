import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageComponent } from './page/page.component';
import { ProductChoiceComponent } from './sections/product-choice/product-choice.component';
import { NoticesComponent } from './sections/notices/notices.component';
import { JoinInformationComponent } from './sections/join-information/join-information.component';
import { ReviewComponent } from './sections/review/review.component';
import { FinishComponent } from './sections/finish/finish.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [
    AppComponent,
    PageComponent,
    ProductChoiceComponent,
    NoticesComponent,
    JoinInformationComponent,
    ReviewComponent,
    FinishComponent
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
