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

  async downloadResumePress(previewOrDownload: string) {
    const templateID = this.selectedTemplateID || sessionStorage.getItem('selectedTemplateID');
  
    if (!templateID) {
      alert('Please select a resume template before proceeding.');
      return;
    }
  
    try {
      // Call backend to generate the resume
      this.auth.downloadResume(templateID, previewOrDownload).subscribe({
        next: (response: any) => {
          if (previewOrDownload === '1') {
            // For download
            const fileName = response.fileDownloadName; // Get the file name from the response
            console.log(fileName);
            console.log("Response: ", response.fileDownloadName);
            this.fetchResume(fileName); // Trigger fetch to download the file
          } else if (previewOrDownload === '2') {
            // For preview
            const filePath = response.filePath; // Get the file path from the response
            if (filePath) {
              window.open(filePath, '_blank'); // Open the file in a new tab
            } else {
              alert('Failed to retrieve the preview file path.');
            }
          }
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
  

  previewResumePress() {
    const templateID = sessionStorage.getItem('selectedTemplateID');
    if (!templateID) {
      alert('Please select a resume template before previewing.');
      return;
    }
  
    this.auth.downloadResume(templateID, '2').subscribe({
      next: (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        window.open(url, '_blank'); // Open in a new tab for preview
        window.URL.revokeObjectURL(url); // Clean up URL after use
      },
      error: (error) => {
        console.error('Error fetching preview:', error);
        alert('Failed to fetch the preview.');
      },
    });
  }

  // Method to handle dropdown value change
  onTemplateChange(event: any) {
    this.selectedTemplateID = event.target.value; // Capture the selected value
    sessionStorage.setItem('selectedTemplateID', this.selectedTemplateID); // Save in sessionStorage
    console.log('Selected Template ID:', this.selectedTemplateID); // Debugging
  }
}
