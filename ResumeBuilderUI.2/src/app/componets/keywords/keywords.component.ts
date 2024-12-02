import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { CheckboxControlValueAccessor, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidatorForm from '../../helpers/validateForm';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationStart } from '@angular/router';
import ValidatorLogin from '../../helpers/validateLoginAndOptionChoosen';
import { AppClosingService } from '../../services/appClosing.service';
import { lastValueFrom } from 'rxjs';



@Component({
  selector: 'app-keywords',
  templateUrl: './keywords.component.html',
  styleUrls: ['./keywords.component.css']
})
export class KeywordsComponent implements OnInit {
  selectedKeywords: string[] = [];


  // Inject the Router service into the component
  constructor (private router: Router, private closer: AppClosingService) {}

   // Listener for closing the window or exiting the app. Removes the temp user and their info.
   @HostListener('window:beforeunload', ['$event'])
   beforeUnloadHandler(event: BeforeUnloadEvent) {
     if (sessionStorage.getItem('tempUser') == 'yes') {
       this.router.navigate(['']);
     }
   }

  ngOnInit(): void {
    sessionStorage.setItem('skillsSavedBool', 'true');

    // Retrieve existing keywords from sessionStorage (if any)
    const storedKeywords = sessionStorage.getItem('selectedKeywords');
    if (storedKeywords) {
      this.selectedKeywords = storedKeywords.split(',');
    }
  }

  addKeyword(keyword: string): void {
    if (!this.selectedKeywords.includes(keyword)) {
      this.selectedKeywords.push(keyword);
      sessionStorage.setItem('selectedKeywords', this.selectedKeywords.join(', '));
    }
    console.log('Keywords:', this.selectedKeywords); // Debugging
  }

  goToNextPage(): void {
    const storedKeywords = sessionStorage.getItem('selectedKeywords');
    if(storedKeywords == null)
      sessionStorage.setItem('selectedKeywords', '')
    
    this.router.navigate(['skills']);
  }
  
  goBack(): void {
    this.router.navigate(['education']);
  }

}
