import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidatorForm from '../../helpers/validateForm';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  dashboardForm!: FormGroup;
  nothingToEdit: Boolean = false;
  cameBack: Boolean = sessionStorage.getItem('goBack') == 'yes' ? true: false;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.navigationTrigger === 'popstate') {
          console.log('Popstate navigation detected!');
          sessionStorage.setItem('goBack', 'yes');
        }
      }
    });

    this.checkIfUserIsLoggedInAndOptionChoosen();

    this.dashboardForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      website: ['', Validators.required],
      summary: ['', Validators.required]
    });

    if (sessionStorage.getItem('editing') == 'yes' || this.cameBack) {
      this.auth.getPersonalInfo()
      .subscribe({
        next: (data)=>{
          console.log(data);
          this.fillForm(data.firstName, data.lastName, data.email, data.phoneNumber, data.website, data.summary);
        },
        error: (err)=>{
          if (sessionStorage.getItem('editing') == 'yes')
            alert(err.error);
          this.nothingToEdit = true;
        }
      })
    }
    else if (sessionStorage.getItem('editing') == 'no') {
      this.fillForm('', '', '', '', '', '');
    }
  }

  checkIfUserIsLoggedInAndOptionChoosen(): void {
    const userLoggedIn = sessionStorage.getItem('userId');

    console.log("User ID from session storage:", userLoggedIn);

    // If there is no user ID in the session storage
    if (userLoggedIn == '' || userLoggedIn == '-1' || userLoggedIn == null) {
      this.router.navigate(['login']); // Go to login page if user is not logged in
    }

    const editing = sessionStorage.getItem('editing');

    if (editing == null) {
      this.router.navigate(['resumeOption']); // Go to login page if user is not logged in
    }
  }

  fillForm(first: string, last: string, mail: string, number: string, web: string, sum: string): void {
    this.dashboardForm.setValue({
      firstName: first, 
      lastName: last, 
      email: mail, 
      phoneNumber: number, 
      website: web,
      summary: sum
    });
  }

  editPersonalInfo(): void {
    this.auth.editPersonalInfo(this.dashboardForm.value)
    .subscribe({
      next: (res)=>{
        alert(res.message);
        this.dashboardForm.reset();
        this.router.navigate(['workexperience'])
      },
      error:(err)=>{
        alert(err?.error.message)
      }
    })
  }

  addPersonalInfo(): void {
    this.auth.addPersonalInfo(this.dashboardForm.value)
    .subscribe({
      next: (res)=>{
        alert(res.message);
        this.dashboardForm.reset();
        this.router.navigate(['workexperience'])
      },
      error:(err)=>{
        alert(err?.error.message)
      }
    })
  }

  onSubmit(): void {
    if(this.dashboardForm.valid) {
      console.log(this.dashboardForm.value);
      if ((sessionStorage.getItem('editing') == 'yes' || this.cameBack) && !this.nothingToEdit) {
        this.editPersonalInfo();
      }
      else {
        this.addPersonalInfo();
      }
    }
    else{
      console.log("Form is Invalid");
      //throw error
      ValidatorForm.validateAllFormFileds(this.dashboardForm);
      alert("Your Form is invalid")
    }
  }
}
