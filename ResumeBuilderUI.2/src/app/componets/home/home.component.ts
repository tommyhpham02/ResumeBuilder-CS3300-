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
  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('tempUser');
    sessionStorage.removeItem('major');
    sessionStorage.removeItem('goBack');
    sessionStorage.removeItem('editing');
  }

  onLogin() {
    this.router.navigate(['login']);
  }

  onRegister() {
    this.router.navigate(['signup']);
  }

  onCreate() {
    if (sessionStorage.getItem('tempUser') == 'yes') {
      lastValueFrom(this.auth.deleteAllUsersInfo(true));
      sessionStorage.removeItem('editing');
      sessionStorage.removeItem('goBack');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('tempUser');
    }

    sessionStorage.setItem('editing', 'no');
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
  }

  setUpTempUserId(data: any) {
    sessionStorage.setItem('userId', data);
  }
}
