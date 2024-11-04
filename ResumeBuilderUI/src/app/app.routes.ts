import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './componets/login/login.component';
import { SignupComponent } from './componets/signup/signup.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    {path:'login', component: LoginComponent },
    {path:'signup', component: SignupComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {}