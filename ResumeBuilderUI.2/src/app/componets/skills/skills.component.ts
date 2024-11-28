import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, NavigationStart } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';  
import ValidatorForm from '../../helpers/validateForm';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {
  skillsForm!: FormGroup;
  nothingToEdit: Boolean = false;
  cameBack: Boolean = sessionStorage.getItem('goBack') == 'yes' ? true: false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private location: Location  // Inject Location service
  ) {}

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

    this.skillsForm = this.fb.group({
      languageName: [''],  // Not required
      certificationName: [''],  // Not required
      certificationDate: [''],  // Not required
      skills: [''],  // Not required
      projects: ['']  // Not required
    });

    if (sessionStorage.getItem('editing') == 'yes' || this.cameBack) {
      this.auth.getSkills()
      .subscribe({
        next: (data)=>{
          console.log(data);
          this.fillForm(data.languageName, data.certificationName, data.certificationDate, data.skills, data.projects);
        },
        error: (err)=>{
          if (sessionStorage.getItem('editing') == 'yes')
            alert(err.error);
          this.nothingToEdit = true;
        }
      })
    }
    else if (sessionStorage.getItem('editing') == 'no') {
      this.fillForm('', '', '', '', '');
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

  fillForm(lang: string, certName: string, certDate: string, skill: string, proj: string): void {
    this.skillsForm.setValue({
      languageName: lang, 
      certificationName: certName, 
      certificationDate: certDate, 
      skills: skill, 
      projects: proj
    });
  }

  // Method to handle form submission
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
      ValidatorForm.validateAllFormFileds(this.skillsForm);
      alert("Form is invalid. Please correct the errors.");
    }
  }

  editSkills(): void {
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

  addSkills(): void {
    this.auth.addSkills(this.skillsForm.value)
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

  // Method for handling go back functionality
  goBack() {
    sessionStorage.setItem('goBack', 'yes');
    this.location.back();  // Navigate back to the previous page
  }
}
