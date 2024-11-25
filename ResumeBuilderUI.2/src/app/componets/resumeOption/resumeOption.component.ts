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

  onLogout(){
    this.router.navigate(['dashboard']);
  }
}

