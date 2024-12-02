import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, NavigationStart } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// Was oringally for removing temp user, solved in different manner, kept in case.
export class AppClosingService {

  constructor(private auth: AuthService, private router: Router) { }

    handleAppClosing() {
      if (sessionStorage.getItem('tempUser') == 'yes') 
        lastValueFrom(this.auth.deleteAllUsersInfo(true))
    }
}