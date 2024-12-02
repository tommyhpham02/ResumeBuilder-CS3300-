import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, NavigationStart } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// For removing the User from the database.
export class AppClosingService {

  constructor(private auth: AuthService) { }

    async handleAppClosing() {
      await lastValueFrom(this.auth.deleteAllUsersInfo(true))
    }
}