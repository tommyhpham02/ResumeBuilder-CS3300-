import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidatorForm from '../../helpers/validateForm';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrl: './download.component.css'
})
export class DownloadComponent  {
  downloadForm!: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  selectedTemplateID: string = '';

  ngOnInit() {
    // Initialize the form group with a form control
    this.downloadForm = this.fb.group({
      resumeTemplate: ['', Validators.required] // A single form control
    });
  }

  goBack(){
    this.router.navigate(['skills']);
  }

  optionsPage()
  {
    this.router.navigate(['resumeOption']);
  }

  onLogout(){
    sessionStorage.setItem('userId', '');
    this.router.navigate(['']);
  }

  downloadResumePress() {
    const templateID = this.selectedTemplateID || sessionStorage.getItem('selectedTemplateID');
  
    if (!templateID) {
      alert('Please select a resume template before downloading.');
      return;
    }
  
    this.auth.downloadResume(templateID).subscribe({
      next: (response) => {
        alert('Your resume has been successfully downloaded.');
        console.log('Backend Response:', response);
      },
      error: (error) => {
        alert('An error occurred while downloading the resume.');
        console.error('Backend Error:', error);
      }
    });
  }
  



  previewResumePress() {
    const templateID = sessionStorage.getItem('selectedTemplateID');
    alert("you pressed it");

    if (templateID == "") {
      alert("Please select a resume template before previewing.");
    }
  }

  // Method to handle dropdown value change
  onTemplateChange(event: any) {
    this.selectedTemplateID = event.target.value; // Capture the selected value
    sessionStorage.setItem('selectedTemplateID', this.selectedTemplateID); // Save in sessionStorage
    console.log('Selected Template ID:', this.selectedTemplateID); // Debugging
  }
}
