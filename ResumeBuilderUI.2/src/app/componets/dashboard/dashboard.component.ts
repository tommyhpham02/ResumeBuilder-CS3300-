import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidatorForm from '../../helpers/validateForm';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationStart } from '@angular/router';
import ValidatorLogin  from "../../helpers/validateLoginAndOptionChoosen";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  // Values of page and values for 
  dashboardForm!: FormGroup;
  loginValidator!: ValidatorLogin;
  originalValues: string = '';
  nothingToEdit: Boolean = false;
  cameBack: Boolean = sessionStorage.getItem('goBack') == 'yes' ? true: false;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  // Called when the page gets initialized.
  ngOnInit(): void {
    // Subscribes the event of hitting the back arrow to set "goBack" to yes.
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.navigationTrigger === 'popstate') {
          console.log('Popstate navigation detected!');
          sessionStorage.setItem('goBack', 'yes');
        }
      }
    });

    // Checks to see if user is logged in and has choosen an option for their resume.
    if (!ValidatorLogin.checkIfUserIsLoggedIn()) {
      this.router.navigate(['login']);
    }
    if (!ValidatorLogin.checkIfOptionChoosen()) {
      this.router.navigate(['resumeOption']);
    }

    // assigns values to dashboardForm formgroup
    this.dashboardForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      website: [''],
      summary: ['', Validators.required]
    });

    // Puts values from the database in the textboxes if the user is either editing or has hit go back/back arrow.
    if (sessionStorage.getItem('editing') == 'yes' || this.cameBack) {
      this.auth.getPersonalInfo()
      .subscribe({
        next: (data)=>{
          console.log(data);
          this.fillForm(data.firstName, data.lastName, data.email, data.phoneNumber, data.website, data.summary);
          delete data.id;
          delete data.userId;
          this.originalValues = JSON.stringify(data);
        },
        error: (err)=>{
          if (sessionStorage.getItem('editing') == 'yes')
            alert(err.error);
          this.nothingToEdit = true;
        }
      })
    }
    else {
      this.originalValues = JSON.stringify(this.dashboardForm.value)
    }
  }

  // Fills the dashboardForm with specified values.
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

  // Called when user is updating their entered information in the database. Updates to the current values inside 
  // the textboxes. 
  editPersonalInfo(): void {
    if (this.originalValues != JSON.stringify(this.dashboardForm.value)) {
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
    else {
      this.dashboardForm.reset();
      this.router.navigate(['workexperience'])
    }
  }

  // Called when user is adding their entered information in the database (they currently have none). 
  // Adds the current values inside the textboxes. 
  addPersonalInfo(): void {
    this.auth.addPersonalInfo(this.dashboardForm.value)
    .subscribe({
      next: (res)=>{
        if (JSON.stringify(this.dashboardForm.value) != this.originalValues) 
          alert(res.message);
        this.dashboardForm.reset();
        this.router.navigate(['workexperience'])
      },
      error:(err)=>{
        alert(err?.error.message)
      }
    })
  }

  // Happens when continue button's click event occurs on page. Either edits or adds user's personal info to database.
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
      ValidatorForm.validateAllFormFields(this.dashboardForm);
      alert("Your Form is invalid")
    }
  }
}
