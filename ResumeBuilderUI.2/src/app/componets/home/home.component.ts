import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private router: Router, private auth: AuthService) {}

  onLogin() {
    this.router.navigate(['login']);
  }

  onRegister() {
    this.router.navigate(['signup']);
  }

  onCreate() {
    sessionStorage.setItem('tempUser', 'yes');
    this.auth.createTempUser()
    .subscribe({
      next: (data)=>{
        this.setUpTempUserId(data);
        this.router.navigate(['dashboard']);
      },
      error: (err)=>{
        alert(err.error);
      }
    })
  }

  setUpTempUserId(data: any) {
    sessionStorage.setItem('userId', data);
  }
}
