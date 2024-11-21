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

  type: string = "password";
  isText: Boolean = false;
  eyeIcon: string = "fa-eye-slash";
  userId: any = "";
  loginSuccess: Boolean = false;
  loginForm!: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username:['',Validators.required],
      password:['',Validators.required]
    })
  }

  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";

  }

  onLogin(){
    if(this.loginForm.valid)
    {
      console.log(this.loginForm.value);
      //send obj to database
      this.auth.login(this.loginForm.value)
      .subscribe({
        next: (res)=>{
          alert(res.message);
          this.saveUserId(true);
          this.saveResumeInputId(true);
          this.loginForm.reset();
          this.router.navigate(['dashboard'])
        },
        error:(err)=>{
          alert(err?.error.message)
          this.saveUserId(false);
          this.saveResumeInputId(false);
        }
      })
    }
    else{
      console.log("Form is Invalis");
      //throw error
      ValidatorForm.validateAllFormFileds(this.loginForm);
      alert("Your Form is invalid")
    }
  }

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
      sessionStorage.setItem('userId', '-1');
    }
  }

  saveResumeInputId(valid: Boolean){
    if (valid){
      this.auth.getResumeInputId().subscribe
      (data => 
        {
          sessionStorage.setItem('resumeInputId', data);
        }
      );
      this.loginSuccess = false;
    }
    else{
      sessionStorage.setItem('resumeInputId', '-1');
    }
  }
}
