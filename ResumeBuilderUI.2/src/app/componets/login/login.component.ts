import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidatorForm from '../../helpers/validateForm';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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
  loginSuccess: Boolean = false;
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
  onLogin(){
    if(this.loginForm.valid)
    {
      this.buttonDisabled = true;
      console.log(this.loginForm.value);
      //send obj to database
      this.auth.login(this.loginForm.value)
      .subscribe({
        next: (res)=>{
          this.saveUserId(true);
          alert(res.message);
          this.loginForm.reset();
          this.router.navigate(['resumeOption']);
        },
        error:(err)=>{
          this.buttonDisabled = false;
          this.saveUserId(false);
          alert(err?.error.message)
        }
      })
    }
    else{
      console.log("Form is Invalis");
      //throw error
      ValidatorForm.validateAllFormFields(this.loginForm);
      alert("Your Form is invalid")
    }
  }

  // Takes the username the user entered to find the ID associated with said username. 
  // (Which will be used throughout the rest of the program.)
  saveUserId(valid: Boolean){
    if (valid){
      this.auth.getUserId(this.loginForm.get('username')?.value).subscribe
      (data => 
        {
          sessionStorage.setItem('userId', data);
        }
      );
      this.loginSuccess = false;
    }
    else{
      sessionStorage.setItem('userId', '');
    }
  }
}
