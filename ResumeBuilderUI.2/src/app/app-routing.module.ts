import { NgModule } from '@angular/core';
import { LoginComponent } from './componets/login/login.component';
import { SignupComponent } from './componets/signup/signup.component';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {path:'login', component: LoginComponent },
  {path:'signup', component: SignupComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
