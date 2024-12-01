import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, NavigationStart } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';  
import ValidatorForm from '../../helpers/validateForm';
import { ReactiveFormsModule } from '@angular/forms';
import ValidatorLogin from '../../helpers/validateLoginAndOptionChoosen';

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
    private location: Location  // Inject Location service
  ) {}

  // Called when form is initialized
  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.navigationTrigger === 'popstate') {
          console.log('Popstate navigation detected!');
          sessionStorage.setItem('goBack', 'yes');
        }
      }
    });
    
    // Checks to see if User is logged in and resume option is choosen
    if (!ValidatorLogin.checkIfUserIsLoggedIn()) {
      this.router.navigate(['login']);
    }
    if (!ValidatorLogin.checkIfOptionChoosen()) {
      this.router.navigate(['resumeOption']);
    }

    // Initializes skillsForm group control values.
    this.skillsForm = this.fb.group({
      languageName: [''],  // Not required
      certificationName: [''],  // Not required
      certificationDate: [''],  // Not required
      skills: [''],  // Not required
      projects: ['']  // Not required
    });

    // If the user has come back from a previous page or they have choosen the editing option, fills the textboxes
    // with the values they have entered in the database.
    if (sessionStorage.getItem('editing') == 'yes' || this.cameBack) {
      this.auth.getSkills()
      .subscribe({
        next: (data)=>{
          console.log(data);
          this.fillForm(data.languageName, data.certificationName, data.certificationDate, data.skills, data.projects);
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

  keywordPage(): void {
    window.open('/sugestedWordResource', '_blank');
  }

  // Fills the skillsForm with specified values (the textbox values)
  fillForm(lang: string, certName: string, certDate: string, skill: string, proj: string): void {
    const additionalSkills = sessionStorage.getItem('selectedKeywords') || '';
    const combinedSkills = skill ? `${skill}, ${additionalSkills}` : additionalSkills;
  
    this.skillsForm.setValue({
      languageName: lang || '', // Ensure fallback to empty string
      certificationName: certName || '',
      certificationDate: certDate || '',
      skills: combinedSkills,
      projects: proj || ''
    });
  }

    // Fills the skillsForm with specified values (the textbox values)
    fillSkills(skill: string): void {
      const currentSkills = this.skillsForm.get('skills')?.value || '';
      const additionalSkills = sessionStorage.getItem('selectedKeywords') || '';
      this.skillsForm.get('skills')?.setValue(`${currentSkills}, ${additionalSkills}`);
    }
    
  
  // Method to handle form submission. Either adds or edits entered information.
  onSubmit() {
    console.log("Form Values on Submit:", this.skillsForm.value);

    if (this.skillsForm.valid) {
      console.log(this.skillsForm.value);
      if ((sessionStorage.getItem('editing') == 'yes' || this.cameBack) && !this.nothingToEdit) {
        this.editSkills();
      }
      else {
        this.addSkills();
      }
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
          alert(res.message);
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
        if (JSON.stringify(this.skillsForm.value) != this.originalValues)
          alert(res.message);
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
    this.router.navigate(['education']);
  }
}
