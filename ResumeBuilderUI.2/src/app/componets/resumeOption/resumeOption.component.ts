import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AppClosingService } from '../../services/appClosing.service';
import { lastValueFrom } from 'rxjs';
import ValidatorLogin from '../../helpers/validateLoginAndOptionChoosen';


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
      this.closer.handleAppClosing();
      sessionStorage.removeItem('userId');
    }
  }

  // Called when resume is initialized.
  ngOnInit(): void {
    // Checks if user is logged in and if resumeOption is choosen.
    if (!ValidatorLogin.checkIfUserIsLoggedIn() || sessionStorage.getItem('deleted') == 'yes') {
      this.router.navigate(['']);
    }

    // Removes and sets various sessionstorage variables.
    sessionStorage.removeItem('editing')
    sessionStorage.setItem('selectedKeywords', '')
    sessionStorage.setItem('major', '');
    sessionStorage.setItem('major', 'Nothing');
  }

  // When the edit previous resume button is clicked, sets sessionstorage variable and routes to dashboard.
  onEdit(){
    sessionStorage.setItem('editing', 'yes');
    this.router.navigate(['dashboard']);
  }

  // When new resume is created, removes user's current info.
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

  // Goes to download apge when export button is clicked.
  onExportResume(){
    this.router.navigate(['download']);
  }

  // Goes home if logout is clicked.
  onLogout(){
    this.router.navigate(['']);
  }

  // Goes to tips and tricks if button is clicked.
  onTipsandTricks() {
    this.router.navigate(['resourcePage']);
  }

  // Goes to keywords if keywords link is clicked.
  onKeyWords() {
    this.router.navigate(['sugestedWordResource']);
  }

  // If drop down changed, changes major type.
  changeMajorType(major: string) {
    sessionStorage.setItem('major', major);
  }
}
