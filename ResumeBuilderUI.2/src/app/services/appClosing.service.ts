import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppClosingService {

  constructor(private auth: AuthService) { }

    handleAppClosing() {
        if (sessionStorage.getItem('tempUser') == 'yes') {
            this.auth.deleteAllUsersInfo(true)
            .subscribe({
                next: (res)=>{
                alert(res.message);
                },
                error:(err)=>{
                alert(err?.error.message)
                }
            });
            
        }
        
        console.log('App is closing!');
    
    }
}