import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidatorForm from '../../helpers/validateForm';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AppClosingService } from '../../services/appClosing.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrl: './download.component.css'
})
export class DownloadComponent  {
  downloadForm!: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private closer: AppClosingService) {}

   // Listener for closing the window or exiting the app. Removes the temp user and their info.
   @HostListener('window:beforeunload', ['$event'])
   beforeUnloadHandler(event: BeforeUnloadEvent) {
     if (sessionStorage.getItem('tempUser') == 'yes') {
       this.router.navigate(['']);
     }
   }

  selectedTemplateID: string = '';

  ngOnInit() {
    // Initialize the form group with a form control
    this.downloadForm = this.fb.group({
      resumeTemplate: ['', Validators.required] // A single form control
    });
  }

  goBack(){
    sessionStorage.setItem('goBack', 'yes')
    this.router.navigate(['skills']);
  }

  optionsPage()
  {
    this.router.navigate(['resumeOption']);
  }

  onLogout(){
    this.router.navigate(['']);
  }

  async downloadResumePress() {
    const templateID = this.selectedTemplateID || sessionStorage.getItem('selectedTemplateID');
  
    if (!templateID) {
      alert('Please select a resume template before proceeding.');
      return;
    }
  
    try {
      // Call backend to generate the resume
      this.auth.downloadResume(templateID).subscribe({
        next: (response: any) => {
            // For download
            const fileName = response.fileDownloadName; // Get the file name from the response
            console.log(response);
            console.log("Response: ", response.fileDownloadName);
            this.fetchResume(fileName); // Trigger fetch to download the file
        },
        error: (error) => {
          console.error('Error:', error);
          alert('An error occurred while processing your request.');
        },
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred.');
    }
  }
  
  async fetchResume(fileName: string) {
    this.auth.getResume(fileName).subscribe({
      next: (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName; // Use the file name from the backend
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error fetching file:', error);
        alert('Failed to download the file.');
      },
    });
  }
  
  // Method to handle dropdown value change
  onTemplateChange(event: any) {
    this.selectedTemplateID = event.target.value; // Capture the selected value
    sessionStorage.setItem('selectedTemplateID', this.selectedTemplateID); // Save in sessionStorage
    console.log('Selected Template ID:', this.selectedTemplateID); // Debugging
  }

  previewResumePress() {
    this.router.navigate(['resumeTemplate']);
  }

  goToOptions(){
    this.router.navigate(['resumeOption']);
  }
}
