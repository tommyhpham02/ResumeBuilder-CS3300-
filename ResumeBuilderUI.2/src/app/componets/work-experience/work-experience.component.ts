import { Component, OnInit } from '@angular/core';
import { CheckboxControlValueAccessor, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidatorForm from '../../helpers/validateForm';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-work-experience',
  templateUrl: './work-experience.component.html',
  styleUrl: './work-experience.component.css'
})

export class WorkExperienceComponent {
  workExperienceForm!: FormGroup;
  jobList = new Map<number, any>;
  htmlListOfJobs: string[] = ['', '', ''];
  jobsEntered: Boolean[] = [false, false, false];
  currentJob: Boolean = false;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.workExperienceForm = this.fb.group({
      companyName: ['', Validators.required],
      position: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      currentJobValue: [false],
      jobResponsibilities: ['', Validators.required]
    });
  }

  onCurrentChange(): void {
    this.currentJob = !this.currentJob;
    console.log("Truth Value: " + this.currentJob);
  }

  addJob(): void {
    if (this.jobList.size < 3) {
      if (this.workExperienceForm.valid) {
        if (this.currentJob)
          this.workExperienceForm.get('currentJobValue')?.setValue(true);

        this.saveJobToDatbase(this.workExperienceForm.value);
        console.log("List of Jobs: " + "\n" + "--------------" + "\n");
        this.jobList.forEach(element => {
          console.log(element);
        });
      }
      else {
        alert("Form is invalid!")
      }
    }
    else {
      alert("Cannot have more than 3 jobs!");
    }
  }

  editJob(index: number) {
    this.workExperienceForm = this.jobList.get(Array.from(this.jobList.keys())[index]);
    this.removeJobWithIndex(index);
  }

  saveJobToDatbase(value: any){
    console.log(value);
    this.auth.submitJobsInfo(value)
    .subscribe({
      next:(data) => {
        this.addToHtmlList(this.workExperienceForm.get('companyName')?.value + ' - ' + this.workExperienceForm.get('position')?.value)
        this.jobList.set(data, this.workExperienceForm);
        alert("Job has been saved.")
        this.workExperienceForm.reset();
        this.currentJob = false;
      },
      error: (err) => {
        console.error('Full Error Response:', err);
        alert(err?.error.message);
      }
    })
  }

  addToHtmlList(htmlInsert: string) {
    this.htmlListOfJobs[this.jobList.size] = htmlInsert;
    this.jobsEntered[this.jobList.size] = true;
  }

  removeJobWithIndex(index: number) {
    this.auth.deleteJob(Array.from(this.jobList.keys())[index])
    .subscribe({
      next:(res) => {
        alert(res.message)
      },
      error: (err) => {
        console.error('Full Error Response:', err);
        alert(err?.error.message);
      }
    })
    this.jobList.delete(Array.from(this.jobList.keys())[index]);
    this.htmlListOfJobs.splice(index, 1);
    this.jobsEntered.splice(index, 1);
  }

  continueButtonPushed(){
    if (this.jobList.size >= 1) {
      this.workExperienceForm.reset();
      this.router.navigate(['download']);
    }
    else {
      alert("No jobs entered. Proceeding")
      this.router.navigate(['download']);
    }
  }
}

/*
const MAX_JOBS = 3;

const jobContainer = document.getElementById("jobContainer") as HTMLElement;
const addJobButton = document.getElementById("addJobButton") as HTMLInputElement;
const jobList = document.getElementById("jobList") as HTMLUListElement;

let jobCount = 1;

// Function to add a new job entry
function addJob(): void {
  if (jobCount >= MAX_JOBS) {
    alert("You can only add up to 3 job entries.");
    return;
  }

  // Create a new job entry
  const jobEntry = document.createElement("div");
  jobEntry.classList.add("job-entry");
  jobEntry.innerHTML = `
    <div class="user-details">
      <div class="input-box">
        <span class="details">Company Name</span>
        <input type="text" placeholder="Enter the Company Name" required>
      </div>
      <div class="input-box">
        <span class="details">Position</span>
        <input type="text" placeholder="Position" class="position-input" required>
      </div>
      <div class="input-box">
        <span class="details">Start Date</span>
        <input type="date" required>
      </div>
      <div class="input-box">
        <span class="details">End Date</span>
        <input type="date" class="end-date" required>
        <label>
          <input type="checkbox" class="current-checkbox"> Current
        </label>
      </div>
    </div>
    <div class="summary-box">
      <span class="details">Job Responsibilities</span>
      <textarea placeholder="Add your responsibilities summary" required></textarea>
    </div>
  `;

  // Add the new job entry to the container
  jobContainer.appendChild(jobEntry);

  // Attach event listener to the "Current" checkbox
  const currentCheckbox = jobEntry.querySelector(".current-checkbox") as HTMLInputElement;
  const endDateInput = jobEntry.querySelector(".end-date") as HTMLInputElement;

  currentCheckbox.addEventListener("change", () => toggleEndDate(currentCheckbox, endDateInput));

  // Add the job to the preview list as a hyperlink
  addJobToPreview(jobEntry);

  jobCount++;
}

// Function to toggle the End Date field
function toggleEndDate(checkbox: HTMLInputElement, endDateInput: HTMLInputElement): void {
  if (checkbox.checked) {
    endDateInput.value = ""; // Clear the end date value
    endDateInput.disabled = true; // Disable the input
  } else {
    endDateInput.disabled = false; // Enable the input
  }
}

// Function to add a job to the preview list
function addJobToPreview(jobEntry: HTMLElement): void {
  const positionInput = jobEntry.querySelector(".position-input") as HTMLInputElement;
  const position = positionInput?.value || `Job ${jobCount}`;

  const listItem = document.createElement("li");

  // Create a hyperlink-like appearance
  const link = document.createElement("a");
  link.href = "#";
  link.textContent = position;
  link.classList.add("job-link");

  // Append the link to the list item
  listItem.appendChild(link);
  jobList.appendChild(listItem);
}

// Attach event listener to the Add Job button
addJobButton.addEventListener("click", addJob);

// Add event listener for the initial job entry
const initialCheckbox = document.querySelector("#currentCheckbox") as HTMLInputElement;
const initialEndDate = document.querySelector("#endDate") as HTMLInputElement;
initialCheckbox.addEventListener("change", () => toggleEndDate(initialCheckbox, initialEndDate));
*/