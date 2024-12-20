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
  buttonDisabled: Boolean = false;
  eyeIcon: string = "fa-eye-slash";
  signUpForm!: FormGroup;
  constructor(private fb: FormBuilder, private auth : AuthService, private router: Router) {}

  // Called when form is initialized.
  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  // Hides password in textbox if user wants to do so.
  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  // Registers user in the database with all entered info. (If form is validated)
  onSignUp(){
    if(this.signUpForm.valid)
    {
      this.buttonDisabled = true;
      this.auth.signUp(this.signUpForm.value)
      .subscribe({
        next:(res) =>{
          alert(res.message)
          this.signUpForm.reset();
          this.router.navigate(['login']);
        },
        error: (err) => {
          this.buttonDisabled = false;
          console.error('Full Error Response:', err);
          alert(err?.error?.message || 'An error occurred during registration');
        }
      })
    }
    else{
      console.log("Form is Invalis");
      //throw error
      ValidatorForm.validateAllFormFields(this.signUpForm);
      alert("Your Form is invalid")
    }
  }

}
