import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  buttonDisabled: Boolean = false;
  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    if (sessionStorage.getItem('tempUser') == 'yes') {
      lastValueFrom(this.auth.deleteAllUsersInfo(true));
    }

    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('tempUser');
    sessionStorage.removeItem('major');
    sessionStorage.removeItem('goBack');
    sessionStorage.removeItem('editing');
    this.buttonDisabled = false;
  }

  onLogin() {
    this.router.navigate(['login']);
    this.buttonDisabled = true;
  }

  onRegister() {
    this.router.navigate(['signup']);
    this.buttonDisabled = true;
  }

  onCreate() {
    sessionStorage.setItem('tempUser', 'yes');
    this.auth.createTempUser()
    .subscribe({
      next: (data)=>{
        this.setUpTempUserId(data);
        this.router.navigate(['resumeOption']);
      },
      error: (err)=>{
        alert(err.error);
      }
    })
    this.buttonDisabled = true;
  }

  setUpTempUserId(data: any) {
    sessionStorage.setItem('userId', data);
  }
}
