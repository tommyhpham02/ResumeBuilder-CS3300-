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
export class DownloadComponent {
  downloadForm!: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}


  goBack(){
    this.router.navigate(['skills']);
  }
  downloadResumePress(){
    const userLoggedIn = sessionStorage.getItem('userId')
    this.auth.downloadResume()
      .subscribe({
        next: (res)=>{
          alert(res.message);
        },
        error:(err)=>{
          alert(err?.error.message)
        }
      })
    alert("Your resume has been downloaded");
  }
  optionsPage()
  {
    this.router.navigate(['resumeOption']);
  }
}
