import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private router: Router) {}

  onLogin() {
    this.router.navigate(['login']);
  }

  onRegister() {
    this.router.navigate(['signup']);
  }

  onCreate() {
    this.router.navigate(['dashboard']);
  }
}
