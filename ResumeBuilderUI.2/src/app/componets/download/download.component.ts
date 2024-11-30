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
      let fileHandle: any;
  
      if (previewOrDownload === '1') { // For download
        // Step 1: Prompt user to select a path for saving the file
        fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: 'Resume.pdf',
          types: [
            {
              description: 'PDF Files',
              accept: { 'application/pdf': ['.pdf'] }
            }
          ]
        });
  
        console.log('File handle:', fileHandle);
      }
  
      // Step 2: Call backend to fetch resume content
      this.auth.downloadResume(templateID, previewOrDownload, fileHandle?.name || '').subscribe({
        next: async (response) => {
          console.log('Backend Response:', response);
  
          if (previewOrDownload === '1') { // For download
            // Step 3: Write response content to the selected file
            const writableStream = await fileHandle.createWritable();
            const fileContent = response.fileContent; // Assuming backend returns Blob or Base64
            if (fileContent) {
              const blob = new Blob([fileContent], { type: 'application/pdf' });
              await writableStream.write(blob);
              await writableStream.close();
              alert('Your resume has been successfully downloaded.');
            } else {
              alert('Failed to retrieve the file content from the server.');
            }
          } else if (previewOrDownload === '2') { // For preview
            const filePath = response.filePath; // Backend should return filePath
            if (filePath) {
              window.open(filePath, '_blank'); // Open the preview in a new tab
              alert('Your resume is ready for preview.');
            } else {
              alert('Failed to retrieve the preview file path from the server.');
            }
          }
        },
        error: (error) => {
          console.error('Backend Error:', error);
          alert('An error occurred while processing your request.');
        }
      });
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      alert('An error occurred while processing your request.');
    }
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
