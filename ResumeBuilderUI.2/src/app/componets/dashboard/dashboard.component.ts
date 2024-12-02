import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidatorForm from '../../helpers/validateForm';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationStart } from '@angular/router';
import ValidatorLogin  from "../../helpers/validateLoginAndOptionChoosen";
import { AppClosingService } from '../../services/appClosing.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  // Values of page and values for 
  dashboardForm!: FormGroup;
  loginValidator!: ValidatorLogin;
  originalValues: string = '';
  nothingToEdit: Boolean = false;
  cameBack: Boolean = sessionStorage.getItem('goBack') == 'yes' ? true: false;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private closer: AppClosingService) {}

  // Listener for closing the window or exiting the app. Removes the temp user and their info.
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: BeforeUnloadEvent) {
    if (sessionStorage.getItem('tempUser') == 'yes') {
      this.closer.handleAppClosing();
      sessionStorage.removeItem('userId');
    }
  }


  // Called when the page gets initialized.
  ngOnInit(): void {
    this.createBackButtonEvent();
    // Checks if user is logged in and if resumeOption is choosen.
    if (!ValidatorLogin.checkIfUserIsLoggedIn()) {
      this.router.navigate(['']);
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
      this.originalValues = JSON.stringify(this.dashboardForm.value);
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
          this.dashboardForm.reset();
          this.router.navigate(['workexperience'])
        },
        error:(err)=>{
          alert(err?.error.message)
        }
      })
    }
    // If no info to edit, simply goes to next page.
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
        this.dashboardForm.reset();
        this.router.navigate(['workexperience']);
      },
      error:(err)=>{
        alert(err?.error.message);
      }
    })
  }

  // Happens when continue button's click event occurs on page. Either edits or adds user's personal info to database.
  onSubmit(): void {
    if(this.dashboardForm.valid) {
      if ((sessionStorage.getItem('editing') == 'yes' || this.cameBack) && !this.nothingToEdit) {
        this.editPersonalInfo();
      }
      else {
        this.addPersonalInfo();
      }
    }
    else{
      //throw error
      ValidatorForm.validateAllFormFields(this.dashboardForm);
      alert("Your Form is invalid")
    }
  }

  // Creates event for site to listen to the back arrow being pushed (acts as go back button.)
  createBackButtonEvent(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.navigationTrigger === 'popstate') {
          console.log('Popstate navigation detected!');
          sessionStorage.setItem('goBack', 'yes');
          sessionStorage.setItem('refresh', 'yes');
        }
      }
    });
  }

  // Goes to keyword page
  keywordPage(): void {
    window.open('/sugestedWordResource', '_blank');
  }
}
