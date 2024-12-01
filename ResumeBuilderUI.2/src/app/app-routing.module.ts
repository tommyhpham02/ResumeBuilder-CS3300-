import { NgModule } from '@angular/core';
import { HomeComponent} from './componets/home/home.component'
import { LoginComponent } from './componets/login/login.component';
import { SignupComponent } from './componets/signup/signup.component';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './componets/dashboard/dashboard.component';
import { EducationComponent } from './componets/education/education.component';
import { DownloadComponent } from './componets/download/download.component';
import { SkillsComponent } from './componets/skills/skills.component';
import { WorkExperienceComponent } from './componets/work-experience/work-experience.component';
import { ResumeOptionComponent } from './componets/resumeOption/resumeOption.component';
import { ResumeTemplatePageComponent } from './componets/resumeTemplatePage/resumeTemplatePage.component';
import { AboutComponent } from './componets/about/about.component';

export const routes: Routes = [
  {path:'', component: HomeComponent },
  {path:'login', component: LoginComponent },
  {path:'signup', component: SignupComponent },
  {path:'dashboard', component: DashboardComponent},
  {path:'education', component: EducationComponent},
  {path:'download', component: DownloadComponent},
  {path:'skills', component: SkillsComponent},
  {path:'workexperience', component: WorkExperienceComponent},
  {path:'resumeOption', component: ResumeOptionComponent},
  {path: 'resumeTemplate', component: ResumeTemplatePageComponent},
  {path: 'about', component: AboutComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
