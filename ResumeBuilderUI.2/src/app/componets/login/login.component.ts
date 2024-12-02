import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidatorForm from '../../helpers/validateForm';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationStart } from '@angular/router';
import { lastValueFrom, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  // Values for the form as well as boolean flags for events.
  type: string = "password";
  isText: Boolean = false;
  eyeIcon: string = "fa-eye-slash";
  userId: any = "";
  buttonDisabled: Boolean = false;
  loginForm!: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  // Called when the form is initialized.
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username:['',Validators.required],
      password:['',Validators.required]
    })
  }

  // When triggered, hides/shows the password the user is entering. 
  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  // When login button is hit, disables the button, checks on the backend if the user is registered
  // and that their entered info is correct. If error, button is enabled again, else goes to next page.
  async onLogin(){
    if(this.loginForm.valid)
    {
      this.buttonDisabled = true;
      const source$ = this.auth.login(this.loginForm.value);

      try {
        const res = await lastValueFrom(source$);
        await this.saveUserId();
        alert(res.message);
        this.router.navigate(['resumeOption']);
      }
      catch (error: any) {
        this.buttonDisabled = false;
        alert(error.error.message);
      }
    }
    else{
      //throw error
      ValidatorForm.validateAllFormFields(this.loginForm);
      alert("Your Form is invalid")
    }
  }

  // Takes the username the user entered to find the ID associated with said username. 
  // (Which will be used throughout the rest of the program.)
  async saveUserId() {
    const source$ = this.auth.getUserId(this.loginForm.get('username')?.value)
    const res = await lastValueFrom(source$);
    sessionStorage.setItem('userId', res);

  }
}

