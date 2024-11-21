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
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required, , Validators.pattern(/^\d{10}$/)],
      address: ['', Validators.required],
      summary: ['', Validators.required]
    })
  }

  // Go to the next page when pressing the button
  goToNextPage() {
    if (this.dashboardForm.valid) {
      console.log('Form Data:', this.dashboardForm.value);

      // Navigate to the next page
      this.router.navigate(['education']); // Uncomment and adjust route as needed
    } else {
      console.error('Form is invalid');
    }
  }
}