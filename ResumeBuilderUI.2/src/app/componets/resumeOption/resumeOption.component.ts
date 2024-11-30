import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'resumeOption-root',
  templateUrl: './resumeOption.component.html',
  styleUrl: './resumeOption.component.css'
})
export class ResumeOptionComponent {
  title = 'ResumeBuilderUI.2';
  constructor (private router: Router, private auth: AuthService) {}

  onEdit(){
    sessionStorage.setItem('editing', 'yes');
    this.router.navigate(['dashboard']);
  }

  onNewresume(){
    sessionStorage.setItem('editing', 'no');
    sessionStorage.setItem('goBack', 'no');
    this.auth.deleteAllUsersInfo(false)
    .subscribe({
      next: (res)=>{
        console.log(res.message);
      },
      error: (err)=>{
        console.log(err.message);
      }
    });
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
