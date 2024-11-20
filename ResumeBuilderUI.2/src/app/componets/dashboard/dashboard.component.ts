import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidatorForm from '../../helpers/validateForm';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  dashboardForm!: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.dashboardForm = this.fb.group({
      firstName:['',Validators.required],
      lastName:['',Validators.required],
      email:['',Validators.required],
      phoneNumber:['',Validators.required],
      website:['',Validators.required],
      summary:['',Validators.required]
    })
  }

  onSubmit(){
    if(this.dashboardForm.valid)
    {
      console.log(this.dashboardForm.value);
      //send obj to database
      this.auth.submit(this.dashboardForm.value)
      .subscribe({
        next: (res)=>{
          alert(res.message);
          this.dashboardForm.reset();
          this.router.navigate(['dashboard'])
        },
        error:(err)=>{
          alert(err?.error.message)
        }
      })
    }
    else{
      console.log("Form is Invalis");
      //throw error
      ValidatorForm.validateAllFormFileds(this.dashboardForm);
      alert("Your Form is invalid")
    }
  }
}
