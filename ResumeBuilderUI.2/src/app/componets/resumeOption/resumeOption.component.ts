import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'resumeOption-root',
  templateUrl: './resumeOption.component.html',
  styleUrl: './resumeOption.component.css'
})
export class ResumeOptionComponent {
  title = 'ResumeBuilderUI.2';
  constructor (private router: Router) {}

  onEdit(){
    this.router.navigate(['dashboard']);
  }

  onNewresume(){

    this.router.navigate(['dashboard']);
  }

  onExportResume(){
    this.router.navigate(['download']);
  }

  onLogout(){
    sessionStorage.setItem('userId', '');
    this.router.navigate(['']);
  }

  ngOnInit(): void {
    setTimeout(() => {
      const userLoggedIn = sessionStorage.getItem('userId');
      if (!userLoggedIn) {
        this.router.navigate(['login']);
      }
    }, 10); // Delay to ensure session storage is updated
  }
}
