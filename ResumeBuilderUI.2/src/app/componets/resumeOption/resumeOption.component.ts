import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AppClosingService } from '../../services/appClosing.service';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'resumeOption-root',
  templateUrl: './resumeOption.component.html',
  styleUrl: './resumeOption.component.css'
})
export class ResumeOptionComponent {
  tempUser = sessionStorage.getItem('tempUser') || '';
  title = 'ResumeBuilderUI.2';
  constructor (private router: Router, private auth: AuthService, private closer: AppClosingService) {}

  // Listener for closing the window or exiting the app. Removes the temp user and their info.
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: BeforeUnloadEvent) {
    if (sessionStorage.getItem('tempUser') == 'yes') {
      this.router.navigate(['']);
    }
  }

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
    this.router.navigate(['']);
  }

  ngOnInit(): void {
    sessionStorage.removeItem('editing')
    sessionStorage.setItem('selectedKeywords', '')
    sessionStorage.setItem('major', '');
    setTimeout(() => {
      const userLoggedIn = sessionStorage.getItem('userId');
      if (!userLoggedIn) {
        this.router.navigate(['']);
      }
    }, 10); // Delay to ensure session storage is updated
    sessionStorage.setItem('major', 'Nothing');
  }

  onTipsandTricks() {
    this.router.navigate(['resourcePage']);
  }

  onKeyWords() {
    this.router.navigate(['sugestedWordResource']);
  }

  changeMajorType(major: string) {
    sessionStorage.setItem('major', major);
  }
}
