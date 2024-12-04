import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, NavigationStart } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';  
import ValidatorForm from '../../helpers/validateForm';
import { ReactiveFormsModule } from '@angular/forms';
import ValidatorLogin from '../../helpers/validateLoginAndOptionChoosen';
import { AppClosingService } from '../../services/appClosing.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {
  // Values for page, for flagging events and the formGroup in general.
  skillsForm!: FormGroup;
  nothingToEdit: Boolean = false;
  originalValues: string = '';
  cameBack: Boolean = sessionStorage.getItem('goBack') == 'yes' ? true: false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private location: Location, // Inject Location service
    private closer: AppClosingService
  ) {}

  // Listener for closing the window or exiting the app. Removes the temp user and their info.
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: BeforeUnloadEvent) {
    if (sessionStorage.getItem('tempUser') == 'yes') {
      this.closer.handleAppClosing();
      sessionStorage.removeItem('userId');
    }
  }

  // Called when form is initialized
  ngOnInit(): void {
    
    // Checks if user is logged in and if resumeOption is choosen.
    if (!ValidatorLogin.checkIfUserIsLoggedIn() || sessionStorage.getItem('deleted') == 'yes') {
      this.router.navigate(['']);
    }
    if (!ValidatorLogin.checkIfOptionChoosen()) {
      this.router.navigate(['resumeOption']);
    }

    // Initializes skillsForm group control values.
    this.skillsForm = this.fb.group({
      languageName: [''],  // Not required
      certificationName: [''],  // Not required
      skills: [(sessionStorage.getItem('selectedKeywords') != '') ? sessionStorage.getItem('selectedKeywords') + ', ' : ''],  // Not required
      projects: ['']  // Not required
    });

    // If the user has come back from a previous page or they have choosen the editing option, fills the textboxes
    // with the values they have entered in the database.
    if (sessionStorage.getItem('editing') == 'yes' || this.cameBack) {
      this.auth.getSkills()
      .subscribe({
        next: (data)=>{
          this.fillForm(data.languageName, data.certificationName, data.skills, data.projects);
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
      this.originalValues = JSON.stringify(this.skillsForm.value);
    }
  }

  // Goes to keywords page.
  keywordPage(): void {
    window.open('/sugestedWordResource', '_blank');
  }

  // Fills the skillsForm with specified values (the textbox values)
  fillForm(lang: string, certName: string, skill: string, proj: string): void {  
    let tempSkills = this.skillsForm.get('skills')?.value;
    this.skillsForm.setValue({
      languageName: lang || '', // Ensure fallback to empty string
      certificationName: certName || '',
      skills: (this.skillsForm.get('skills')?.value != '' || null) ? tempSkills += skill : skill || '',
      projects: proj || ''
    });
  } 
  
  // Method to handle form submission. Either adds or edits entered information.
  onSubmit() {

    if (this.skillsForm.valid) {
      if ((sessionStorage.getItem('editing') == 'yes' || this.cameBack) && !this.nothingToEdit) {
        this.editSkills();
      }
      else {
        this.addSkills();
      }
      sessionStorage.setItem('selectedKeywords', '');
    }
    else {
      ValidatorForm.validateAllFormFields(this.skillsForm);
      alert("Form is invalid. Please correct the errors.");
    }
  }

  // Edits User information previously entered in the database.
  editSkills(): void {
    if (this.originalValues != JSON.stringify(this.skillsForm.value)) {
      this.auth.editSkills(this.skillsForm.value)
      .subscribe({
        next: (res)=>{
          this.skillsForm.reset();
          this.router.navigate(['download'])
        },
        error:(err)=>{
          alert(err?.error.message)
        }
      })
    }
    else {
      this.skillsForm.reset();
      this.router.navigate(['download'])
    }
  }

  // Adds user information to the database, if there isn't info already there.
  addSkills(): void {
    this.auth.addSkills(this.skillsForm.value)
    .subscribe({
      next: (res)=>{
        this.skillsForm.reset();
        this.router.navigate(['download'])
      },
      error:(err)=>{
        alert(err?.error.message)
      }
    })
  }

  // Method for handling go back functionality
  goBack() {
    sessionStorage.setItem('goBack', 'yes');
    this.router.navigate(['education']);
  }
}
