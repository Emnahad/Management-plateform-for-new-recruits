import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { ContactComponent } from './contact/contact.component';
import { FaqComponent } from './faq/faq.component';
import { AboutComponent } from './about/about.component';
import { RulesComponent } from './rules/rules.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';

import { ProjectComponent } from './project/project.component';
import { HttpClientModule } from '@angular/common/http';
import { ProjectPopupComponent } from './project-popup/project-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { RouterModule } from '@angular/router';
import { NgToastModule } from 'ng-angular-popup';
import { ToastrModule } from 'ngx-toastr';
import { trigger, transition, style, animate } from '@angular/animations';
import { FooterComponent } from './footer/footer.component';
import { EditComponent } from './edit/edit.component';
import { TeamComponent } from './team/team.component';
import { DepartmentComponent } from './department/department.component';

 // Import animation-related symbols

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    ContactComponent,
    FaqComponent,
    AboutComponent,
    RulesComponent,
    SignupComponent,
    SigninComponent,
    ProjectComponent,
    ProjectPopupComponent,
    FooterComponent,
    EditComponent,
    TeamComponent,
    DepartmentComponent,
  
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, 
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MdbModalModule,
    ReactiveFormsModule,
    RouterModule,
    NgToastModule,
   
    ToastrModule.forRoot(),
  ],
  providers: [
    
    
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  
})

export class AppModule { }
