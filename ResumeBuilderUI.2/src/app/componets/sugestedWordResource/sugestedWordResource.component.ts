import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import ValidatorLogin from '../../helpers/validateLoginAndOptionChoosen';

@Component({
  selector: 'sugestedWordResource-root',
  templateUrl: './sugestedWordResource.component.html',
  styleUrl: './sugestedWordResource.component.css'
})
export class SugestedWordResourceComponent {
  title = 'ResumeBuilderUI.2';
  constructor (private router: Router, private auth: AuthService) {}

  // Called when form is initialized.
  ngOnInit(): void {
    // Checks if user is logged in and if resumeOption is choosen.
    if (!ValidatorLogin.checkIfUserIsLoggedIn() || sessionStorage.getItem('deleted') == 'yes') {
      this.router.navigate(['']);
    }
  }

  // Closes the window.
  toClose() {
    window.close();
  }
}
