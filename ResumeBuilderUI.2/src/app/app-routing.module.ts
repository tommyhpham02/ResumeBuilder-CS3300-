import { NgModule } from '@angular/core';
import { LoginComponent } from './componets/login/login.component';
import { SignupComponent } from './componets/signup/signup.component';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './componets/dashboard/dashboard.component';
import { EducationComponent } from './componets/education/education.component';

export const routes: Routes = [
  {path:'login', component: LoginComponent },
  {path:'signup', component: SignupComponent },
  {path:'dashboard', component: DashboardComponent},
  {path:'education', component: EducationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
