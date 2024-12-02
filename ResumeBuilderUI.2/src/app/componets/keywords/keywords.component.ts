import { Component, HostListener } from '@angular/core';
import { AppClosingService } from '../../services/appClosing.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-keywords',
  templateUrl: './keywords.component.html',
  styleUrl: './keywords.component.css'
})
export class KeywordsComponent {

  constructor (private router: Router, private closer: AppClosingService) {}

   // Listener for closing the window or exiting the app. Removes the temp user and their info.
   @HostListener('window:beforeunload', ['$event'])
   beforeUnloadHandler(event: BeforeUnloadEvent) {
     if (sessionStorage.getItem('tempUser') == 'yes') {
       this.router.navigate(['']);
     }
   }

}
