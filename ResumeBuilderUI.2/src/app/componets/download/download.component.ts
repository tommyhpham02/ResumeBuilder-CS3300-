import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidatorForm from '../../helpers/validateForm';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrl: './download.component.css'
})
export class DownloadComponent {
  downloadForm!: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Use `this.fb` to initialize the form
    this.downloadForm = this.fb.group({
      resumeTemplate: ['', Validators.required] // Control with validation
    });
  }

  goBack(){
    this.router.navigate(['skills']);
  }
  
  downloadResumePress(): void {
    const templateID = parseInt(this.downloadForm.get('resumeTemplate')?.value, 10); // Convert string to number
    const userId = sessionStorage.getItem('userId');
  
    if (!templateID) {
      alert('Please select a template before downloading.');
      return;
    }
  
    this.auth.downloadResume(templateID).subscribe({
      next: (res) => {
        alert(res.message);
      },
      error: (err) => {
        alert(err?.error.message);
      }
    });
  
    alert('Your resume has been downloaded');
  }
  

  optionsPage()
  {
    this.router.navigate(['resumeOption']);
  }

  previewResumePress() {
    const templateID = sessionStorage.getItem('templateID');
    alert("you pressed it");

    if (templateID == "") {
      alert("Please select a resume template before previewing.");
    }
  }
    // Method triggered when dropdown selection changes
    onTemplateChange(event: Event): void {
      const selectedValue = (event.target as HTMLSelectElement).value;
    
      if (selectedValue) {
        const templateID = parseInt(selectedValue, 10); // Convert the string to a number
        console.log('Selected Template ID as Number:', templateID);
        sessionStorage.setItem('templateID', templateID.toString()); // Save as a string to sessionStorage
      } else {
        console.error('No template selected.');
      }
    }

    onLogout(){
      sessionStorage.setItem('userId', '');
      this.router.navigate(['']);
    }

}
