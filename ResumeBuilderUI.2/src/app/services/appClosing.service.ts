import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, NavigationStart } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppClosingService {

  constructor(private auth: AuthService, private router: Router) { }

    handleAppClosing() {
      if (sessionStorage.getItem('tempUser') == 'yes') 
        lastValueFrom(this.auth.deleteAllUsersInfo(true))
    }
}