import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';  

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

  title = 'ResumeBuilderUI.2';
  constructor (private router: Router) {}

  goBack(): void {
    sessionStorage.setItem('goBack', 'yes');
    this.router.navigate(['resumeOption']);
    }
}
