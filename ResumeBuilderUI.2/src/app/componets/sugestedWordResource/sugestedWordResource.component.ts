import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'sugestedWordResource-root',
  templateUrl: './sugestedWordResource.component.html',
  styleUrl: './sugestedWordResource.component.css'
})
export class SugestedWordResourceComponent {
  title = 'ResumeBuilderUI.2';
  constructor (private router: Router, private auth: AuthService) {}

  toClose() {
    window.close();
  }
}
