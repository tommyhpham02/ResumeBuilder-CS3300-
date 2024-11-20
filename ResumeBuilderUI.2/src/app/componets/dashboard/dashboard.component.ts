import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidatorForm from '../../helpers/validateForm';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  dashboardForm!: FormGroup;
  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.dashboardForm = this.fb.group({
      firstName: ['', Validators.required]
    })
  }

  // Go to the next page when pressing the button
  goToNextPage() {
    // Go to the next page
    console.log('Go to the next page');

    //this.router.navigate(['login']);
  }
}
