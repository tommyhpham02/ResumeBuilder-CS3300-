import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private location: Location  // Inject Location service
  ) {}

  ngOnInit(): void {
    this.skillsForm = this.fb.group({
      languageName: [''],
      proficiency: [''],
      certificationName: [''],
      certificationDate: [''],
      skills: [''],
      projects: [''] 
    });
  }

  // Method to handle form submission
  onSubmit() {
    console.log("Form Values on Submit:", this.skillsForm.value);
  
    if (this.skillsForm.valid) {
      this.auth.submitSLC(this.skillsForm.value).subscribe({
        next: (res) => {
          console.log("Response:", res);
          alert(res.message);
          this.skillsForm.reset();
          this.router.navigate(['download']);
        },
        error: (err) => {
          console.error("Error during submission:", err);
          alert(err?.error?.message || "Submission failed");
        }
      });
    } else {
      ValidatorForm.validateAllFormFileds(this.skillsForm);
      alert("Form is invalid. Please correct the errors.");
    }
  }

  // Method for handling go back functionality
  goBack() {
    this.location.back();  // Navigate back to the previous page
  }
}
