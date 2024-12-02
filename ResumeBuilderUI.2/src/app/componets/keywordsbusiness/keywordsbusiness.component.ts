import { Component, OnInit, HostListener} from '@angular/core';
import { Router } from '@angular/router';
import ValidatorLogin from '../../helpers/validateLoginAndOptionChoosen';

@Component({
  selector: 'app-keywordsbusiness',
  templateUrl: './keywordsbusiness.component.html',
  styleUrls: ['./keywordsbusiness.component.css']
})
export class KeywordsBusinessComponent implements OnInit {
  selectedKeywords: string[] = [];

  // Inject the Router service into the component
  constructor(private router: Router) {}

  // Listener for closing the window or exiting the app. Removes the temp user and their info.
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: BeforeUnloadEvent) {
    if (sessionStorage.getItem('tempUser') == 'yes') {
      sessionStorage.setItem('deleted', 'yes');
    }
  }
  
  // Called when form is initialized.
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
