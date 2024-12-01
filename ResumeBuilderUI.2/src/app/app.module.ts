import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './componets/login/login.component';
import { SignupComponent } from './componets/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpContext } from '@angular/common/http';
import { DashboardComponent } from './componets/dashboard/dashboard.component';
import { EducationComponent } from './componets/education/education.component';
import { HomeComponent } from './componets/home/home.component';
import { SkillsComponent } from './componets/skills/skills.component';
//import { jwtDecode } from 'jwt-decode';
import { WorkExperienceComponent } from './componets/work-experience/work-experience.component';
import { DownloadComponent } from './componets/download/download.component';
import { ResumeTemplatePageComponent } from './componets/resumeTemplatePage/resumeTemplatePage.component';
import { ResourcePageComponent } from './componets/resourcePage/resourcePage.component';
import { SugestedWordResourceComponent } from './componets/sugestedWordResource/sugestedWordResource.component';
import { AboutComponent } from './componets/about/about.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    EducationComponent,
    HomeComponent,
    SkillsComponent, 
    WorkExperienceComponent,
    DownloadComponent,
    ResumeTemplatePageComponent,
    ResourcePageComponent,
    SugestedWordResourceComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
