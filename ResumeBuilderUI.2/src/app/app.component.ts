import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ResumeBuilderUI.2';
  constructor (private router: Router) {}

  onLogin(){
    this.router.navigate(['login']);
  }

  onRegister(){
    this.router.navigate(['signup']);
  }

  onCreate(){
    this.router.navigate(['dashboard']);
  }
}

