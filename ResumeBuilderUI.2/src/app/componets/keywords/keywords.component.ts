import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-keywords',
  templateUrl: './keywords.component.html',
  styleUrls: ['./keywords.component.css']
})
export class KeywordsComponent implements OnInit {
  selectedKeywords: string[] = [];

  // Inject the Router service into the component
  constructor(private router: Router) {}

  ngOnInit(): void {
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
    
    this.router.navigate(['skills']);
  }
}
