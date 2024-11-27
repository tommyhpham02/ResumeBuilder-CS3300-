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
  jobListViewable: Boolean = false;
  editMode: Boolean = false;
  jobIdToEdit: number = -1;
  jobIndexToEdit: number = -1;
  todayDate: Date = new Date();
  todayDateString: string = `${this.todayDate.getFullYear()}-${this.todayDate.getMonth() + 1}-${this.todayDate.getDate()}`;

  displayString: string = "display:block;";
  hideString: string = "display:none;";
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
    if (sessionStorage.getItem('editMode') == 'yes') {
      this.auth.getListOfEnteredJobs()
      .subscribe(data => {
          for (let i = 0; i < data.length; i++){
            let jsonData = JSON.parse(this.makeKeysLowercase(data[i]));
            let id = jsonData['id'];
            delete jsonData.userId;
            delete jsonData.id;
            jsonData['checkBox'] = jsonData['endDate'] == this.todayDateString ? true : false;
            this.addToHtmlList(jsonData['companyName'] + " - " + jsonData['position']);
            this.jobList.set(id, jsonData)
            console.log(this.jobList.get(id));
          }
          if (this.jobList.size > 0)
            this.jobListViewable = true;
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
    if (end == this.todayDateString)
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
        .setValue(this.todayDateString);
    }
    else {
      this.workExperienceForm.controls['endDate'].setValue('');
    }
  }

  // For when the current checkbox is clicked, but edits are made to the date.
  checkIfCurrent(): void {
    if ((this.workExperienceForm.controls['endDate'].value != this.todayDateString) && (this.currentJob == true)) {
          this.currentJob = false;
          this.workExperienceForm.controls['checkBox'].setValue(this.currentJob);
        }
  }

  // Adds job to database if form is valid and no more than three already in database.
  addJob(): void {
    if (this.jobList.size < 3) {
      if (this.workExperienceForm.valid) {
        if (!this.jobListViewable)
          this.jobListViewable = true;

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
    let jobToEdit = this.jobList.get(Array.from(this.jobList.keys())[index]);
    this.setFormGroup(jobToEdit[`companyName`], jobToEdit[`position`], jobToEdit[`startDate`], jobToEdit[`endDate`],
      jobToEdit[`jobResponsibilities`]);

      this.jobListViewable = false;
      this.editMode = true;
      this.jobIdToEdit = Array.from(this.jobList.keys())[index];
      this.jobIndexToEdit = index;
  }

  // Edits job in the actual database, if the user makes edits and hits the make edits button.
  editJobInDatabase(): void {
    if ((JSON.stringify(this.workExperienceForm.value) != JSON.stringify(this.jobList.get(this.jobIdToEdit))) && this.workExperienceForm.valid){
      this.auth.editJob(this.workExperienceForm.value, this.jobIdToEdit)
      .subscribe({
        next:(res) => {
          alert(res.message);
          this.htmlListOfJobs.splice(this.jobIndexToEdit, 1, 
            this.workExperienceForm.controls['companyName'].value + ' - ' + this.workExperienceForm.controls['position'].value);
          this.jobList.set(this.jobIdToEdit, this.workExperienceForm.value);
          this.setFormGroup('', '', '', '', '');
          this.resetEditValues();
        },
        error: (err) => {
          console.error('Full Error Response:', err);
          alert(err?.error.message);
        }
      });
    }
    else if (JSON.stringify(this.workExperienceForm.value) == JSON.stringify(this.jobList.get(this.jobIdToEdit))) {
      alert("Nothing has been changed! Make an edit or cancel.");
    }
    else {
      alert("Form is invalid");
    }
  }

  // For if user hits the cancel button while editing, does nothing, just resets the form and necessary boolean values.
  cancelEdit(): void {
    this.setFormGroup('', '', '', '', '');
    this.resetEditValues();
  }

  // Resets necessary values when editing is over.
  resetEditValues(): void {
    this.currentJob = false;
    this.editMode = false;
    this.jobListViewable = true;
    this.jobIdToEdit = -1;
    this.jobIndexToEdit = -1; 
  }

  // Saves job to database and adds to appropriate lists.
  saveJobToDatbase(value: any) {
    this.auth.submitJobsInfo(value)
    .subscribe({
      next:(data) => {
        alert("Job has been saved.");
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
      this.jobListViewable = false;
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