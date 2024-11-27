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
    // Get the user ID from the session storage
    const userLoggedIn = sessionStorage.getItem('userId');
    if(userLoggedIn!=null)
    {
      // If there is no user ID in the session storage
      if (userLoggedIn == '' || userLoggedIn == '-1' || userLoggedIn == null) {
        this.router.navigate(['login']); // Go to login page if user is not logged in
      }
    }
  }
}
