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
  // boolean flag for buttons being enabled.
  buttonDisabled: Boolean = false;
  constructor(private router: Router, private auth: AuthService) {}

  // Called when form initializes
  ngOnInit(): void {
    if (sessionStorage.getItem('tempUser') == 'yes') {
      this.deleteTempUser();
    }

    // Removes all previous session storage variables.
    sessionStorage.removeItem('deleted');
    sessionStorage.removeItem('tempUser');
    sessionStorage.removeItem('major');
    sessionStorage.removeItem('goBack');
    sessionStorage.removeItem('editing');
    sessionStorage.removeItem('selectedKeywords');
    sessionStorage.removeItem('skillsSavedBool');
    sessionStorage.removeItem('userId');
    this.buttonDisabled = false;
  }

  // Async function for deleting the user.
  async deleteTempUser() {
    await lastValueFrom(this.auth.deleteAllUsersInfo(true))
  }

  // Triggered when Login button is hit. GOes to login page.
  onLogin() {
    this.router.navigate(['login']);
    this.buttonDisabled = true;
  }

  // Triggered when Register button is hit. Goes to register page.
  onRegister() {
    this.router.navigate(['signup']);
    this.buttonDisabled = true;
  }

  // Triggers when create resume button hit. Creates resume for temp user.
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

  // Sets up the temp user in the database.
  setUpTempUserId(data: any) {
    sessionStorage.setItem('userId', data);
  }
}
