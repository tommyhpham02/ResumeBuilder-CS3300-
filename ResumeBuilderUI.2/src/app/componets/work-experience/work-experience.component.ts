import { Component, OnInit, ViewChild } from '@angular/core';
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
  editMode: Boolean = false;
  editingResume: Boolean = true;
  todayDate: Date = new Date();
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Get the user ID from the session storage
    const userLoggedIn = sessionStorage.getItem('userId');

    // If there is no user ID in the session storage
    if (userLoggedIn == '' || userLoggedIn == '-1' || userLoggedIn == null) {
      this.router.navigate(['login']); // Go to login page if user is not logged in
    }

    this.setFormGroup('', '', '', '', '');

    // If editing the resume (set up variable later) takes already stored jobs from database to put into list
    if (this.editingResume) {
      this.auth.getListOfEnteredJobs()
      .subscribe(data => {
          for (let i = 0; i < data.length; i++){
            let jsonData = JSON.parse(this.makeKeysLowercase(data[i]));
            let id = jsonData['id'];
            delete jsonData.UserId;
            delete jsonData.Id;
            this.addToHtmlList(jsonData['companyName'] + " - " + jsonData['position']);
            this.jobList.set(id, jsonData)
          }
          if (this.jobList.size > 0)
            this.editMode = true;
      });
    }
    // Or if not editing, deletes all jobs associated with the user.
    else {
      this.auth.deleteAllJobs()
      .subscribe({
        next:(res) => {
          console.log(res.message)
        },
        error: (err) => {
          console.error('Full Error Response:', err);
          alert(err?.error.message);
        }
      });
    }
  }

  // Sets the form to have certain values as well as the checkbox
  setFormGroup(name: string, pos: string, start: string, end: string, res: string) : void {
    if (end == `${this.todayDate.getFullYear()}-${this.todayDate.getMonth() + 1}-${this.todayDate.getDate()}`)
      this.currentJob = true;
    else
      this.currentJob = false;

    this.workExperienceForm = this.fb.group({
      companyName: [name, Validators.required],
      position: [pos, Validators.required],
      startDate: [start, Validators.required],
      endDate: [end, Validators.required],
      jobResponsibilities: [res, Validators.required],
      checkBox: new FormControl(this.currentJob)
    });
  }

  // When recieving from the API, takes the string and replaces capitalized letters with lowercase ones in JSON string.
  makeKeysLowercase(jsonData: string): string {
    jsonData = jsonData.replace("\"Id\":", "\"id\":");
    jsonData = jsonData.replace("\"UserId\":", "\"userId\":");
    jsonData = jsonData.replace("\"CompanyName\":", "\"companyName\":");
    jsonData = jsonData.replace("\"Position\":", "\"position\":");
    jsonData = jsonData.replace("\"StartDate\":", "\"startDate\":");
    jsonData = jsonData.replace("\"EndDate\":", "\"endDate\":");
    jsonData = jsonData.replace("\"JobResponsibilities\":", "\"jobResponsibilities\":");

    return jsonData;
  }

  // For when the current checkbox is clicked.
  onCurrentChange(): void {
    this.currentJob = !this.currentJob;
    if (this.currentJob) {
      this.workExperienceForm.controls['endDate']
        .setValue(`${this.todayDate.getFullYear()}-${this.todayDate.getMonth() + 1}-${this.todayDate.getDate()}`);
    }
    else {
      this.workExperienceForm.controls['endDate'].setValue('');
    }
  }

  // For when the current checkbox is clicked, but edits are made to the date.
  checkIfCurrent(): void {
    if ((this.workExperienceForm.controls['endDate'].value != 
        `${this.todayDate.getFullYear()}-${this.todayDate.getMonth() + 1}-${this.todayDate.getDate()}`) &&
        (this.currentJob == true)) {
          this.currentJob = false;
          this.workExperienceForm.controls['checkBox'].setValue(this.currentJob);
        }
  }

  // Adds job to database if form is valid and no more than three already in database.
  addJob(): void {
    if (this.jobList.size < 3) {
      if (this.workExperienceForm.valid) {
        if (!this.editMode)
          this.editMode = true;

        this.saveJobToDatbase(this.workExperienceForm.value)
      }
      else {
        alert("Form is invalid!")
      }
    }
    else {
      alert("Cannot have more than 3 jobs!");
    }
  }

  // Replaces input fields with specified job wanting to edit, removes original from database. 
  editJob(index: number) {
    this.editMode = false;
    let jobToEdit = this.jobList.get(Array.from(this.jobList.keys())[index]);
    this.setFormGroup(jobToEdit[`companyName`], jobToEdit[`position`], jobToEdit[`startDate`], jobToEdit[`endDate`],
      jobToEdit[`jobResponsibilities`]);

    this.removeJobWithIndex(index);
  }

  // Saves job to database and adds to appropriate lists.
  saveJobToDatbase(value: any) {
    this.auth.submitJobsInfo(value)
    .subscribe({
      next:(data) => {
        alert("Job has been saved.");
        this.workExperienceForm.removeControl('checkBox');
        this.addToHtmlList(this.workExperienceForm.controls['companyName'].value + ' - ' + this.workExperienceForm.controls['position'].value)
        this.jobList.set(data, value);
        this.setFormGroup('', '', '', '', '');
        this.currentJob = false;
      },
      error: (err) => {
        console.error('Full Error Response:', err);
        alert(err?.error.message);
      }
    });
  }

  // Adds job information needed for displaying on frontend.
  addToHtmlList(htmlInsert: string) {
    this.htmlListOfJobs[this.jobList.size] = htmlInsert;
    this.jobsEntered[this.jobList.size] = true;
  }

  // Removes job from database and lists with specified index.
  removeJobWithIndex(index: number): void {
    console.log(this.jobList.get(Array.from(this.jobList.keys())[index]))
    this.auth.deleteJob(Array.from(this.jobList.keys())[index])
    .subscribe({
      next:(res) => {
        console.log(res.message)
      },
      error: (err) => {
        console.error('Full Error Response:', err);
        alert(err?.error.message);
      }
    })
    this.jobList.delete(Array.from(this.jobList.keys())[index]);
    this.htmlListOfJobs.splice(index, 1);
    this.jobsEntered.splice(index, 1);

    if (this.jobList.size == 0)
      this.editMode = false;
  }

  // Continues to next page
  continueButtonPushed(): void {
    if (this.jobList.size >= 1) {
      this.workExperienceForm.reset();
      this.router.navigate(['download']);
    }
    else {
      alert("No jobs entered. Proceeding")
      this.router.navigate(['download']);
    }
  }

  // Goes back to previous page.
  goBackButtonPushed(): void {
    this.workExperienceForm.reset();
    this.router.navigate(['skills']);
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