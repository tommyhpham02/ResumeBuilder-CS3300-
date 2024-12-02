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
      sessionStorage.setItem('deleted', 'yes');
    }
  }

  // Called when from is initialized.
  ngOnInit(): void {
    // Checks if user is logged in and if resumeOption is choosen.
    if (!ValidatorLogin.checkIfUserIsLoggedIn() || sessionStorage.getItem('deleted') == 'yes') {
      this.router.navigate(['']);
    }
    if (!ValidatorLogin.checkIfOptionChoosen()) {
      this.router.navigate(['resumeOption']);
    }

    sessionStorage.setItem('skillsSavedBool', 'true');

    // Retrieve existing keywords from sessionStorage (if any)
    const storedKeywords = sessionStorage.getItem('selectedKeywords');
    if (storedKeywords) {
      this.selectedKeywords = storedKeywords.split(',');
    }
  }

  // For adding a keyword to the "selectedKeywords" session variable.
  addKeyword(keyword: string): void {
    if (!this.selectedKeywords.includes(keyword)) {
      this.selectedKeywords.push(keyword);
      sessionStorage.setItem('selectedKeywords', this.selectedKeywords.join(', '));
    }
  }

  // Goes to skills page on button press, checks if any words were chosen. If not, sets session variable to empty string.
  goToNextPage(): void {
    const storedKeywords = sessionStorage.getItem('selectedKeywords');
    if(storedKeywords == null)
      sessionStorage.setItem('selectedKeywords', '')
    
    this.router.navigate(['skills']);
  }

  // Goes back to education when continue button is pressed.
  goBack(): void {
    this.router.navigate(['education']);
  }

}
