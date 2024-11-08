import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidatorForm from '../../helpers/validateForm';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {

  type: string = "password";
  isText: Boolean = false;
  eyeIcon: string = "fa-eye-slash";
  signUpForm!: FormGroup;
  constructor(private fb: FormBuilder, private auth : AuthService, private router: Router) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  onSignUp(){
    if(this.signUpForm.valid)
    {
      this.auth.signUp(this.signUpForm.value)
      .subscribe({
        next:(res) =>{
          alert(res.message)
          this.signUpForm.reset();
          this.router.navigate(['login']);
        },
        error: (err) => {
          console.error('Full Error Response:', err);
          alert(err?.error?.message || 'An error occurred during registration');
        }
      })
      console.log(this.signUpForm.value);
      //Logic for sign up
    }
    else{
      console.log("Form is Invalis");
      //throw error
      ValidatorForm.validateAllFormFileds(this.signUpForm);
      alert("Your Form is invalid")
    }
  }

}
