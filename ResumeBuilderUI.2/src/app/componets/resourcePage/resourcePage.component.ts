import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AppClosingService } from '../../services/appClosing.service';
import ValidatorLogin from '../../helpers/validateLoginAndOptionChoosen';

@Component({
  selector: 'resourcePage-root',
  templateUrl: './resourcePage.component.html',
  styleUrl: './resourcePage.component.css'
})
export class ResourcePageComponent {
  title = 'ResumeBuilderUI.2';
  constructor (private router: Router, private auth: AuthService, private closer: AppClosingService) {}

  // Listener for closing the window or exiting the app. Removes the temp user and their info.
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: BeforeUnloadEvent) {
    if (sessionStorage.getItem('tempUser') == 'yes') {
      sessionStorage.setItem('deleted', 'yes');
    }
  }

  ngOnInit(): void {
    // Checks if user is logged in and if resumeOption is choosen.
    if (!ValidatorLogin.checkIfUserIsLoggedIn() || sessionStorage.getItem('deleted') == 'yes') {
      this.router.navigate(['']);
    }
  }

  // Goes back to previous page.
  goBack() {
    window.history.back();
  }
}
