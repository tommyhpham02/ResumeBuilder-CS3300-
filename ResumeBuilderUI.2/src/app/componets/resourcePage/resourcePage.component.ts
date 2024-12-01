import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'resourcePage-root',
  templateUrl: './resourcePage.component.html',
  styleUrl: './resourcePage.component.css'
})
export class ResourcePageComponent {
  title = 'ResumeBuilderUI.2';
  constructor (private router: Router, private auth: AuthService) {}

  goBack() {
    window.history.back();
  }
}
