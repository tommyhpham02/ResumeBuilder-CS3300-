import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AppClosingService } from '../../services/appClosing.service';

@Component({
  selector: 'resourcePage-root',
  templateUrl: './resourcePage.component.html',
  styleUrl: './resourcePage.component.css'
})
export class ResourcePageComponent {
  title = 'ResumeBuilderUI.2';
  constructor (private router: Router, private auth: AuthService, private closer: AppClosingService) {}

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: BeforeUnloadEvent) {
    if (sessionStorage.getItem('tempUser') == 'yes') {
      this.closer.handleAppClosing();
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('tempUser');
      this.router.navigate(['']);
    }
  }

  goBack() {
    window.history.back();
  }
}
