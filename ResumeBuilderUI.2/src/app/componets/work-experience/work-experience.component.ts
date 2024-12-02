import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { CheckboxControlValueAccessor, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidatorForm from '../../helpers/validateForm';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationStart } from '@angular/router';
import ValidatorLogin from '../../helpers/validateLoginAndOptionChoosen';
import { AppClosingService } from '../../services/appClosing.service';


@Component({
  selector: 'app-work-experience',
  templateUrl: './work-experience.component.html',
  styleUrl: './work-experience.component.css'
})

export class WorkExperienceComponent {
  // Form vales as well as boolean flags trigged by events.
  // Also holds list of information of each degree, and list of if a degree has been entered.
  workExperienceForm!: FormGroup;
  jobList = new Map<number, any>;
  htmlListOfJobs: string[] = ['', '', ''];
  jobsEntered: Boolean[] = [false, false, false];
  currentJob: Boolean = false;
  jobListViewable: Boolean = false;
  editMode: Boolean = false;
  cameBack: Boolean = sessionStorage.getItem('goBack') == 'yes' ? true: false;
  jobIdToEdit: number = -1;
  jobIndexToEdit: number = -1;
  todayDate: Date = new Date();
  todayDateString: string = `${this.todayDate.getFullYear()}-${this.todayDate.getMonth() + 1}-${
    this.todayDate.getDate().toString().length == 1 ? `0${this.todayDate.getDate()}` : `${this.todayDate.getDate()}`}`;

  displayString: string = "display:block;";
  hideString: string = "display:none;";
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private closer: AppClosingService) {}

  // Listener for closing the window or exiting the app. Removes the temp user and their info.
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: BeforeUnloadEvent) {
    if (sessionStorage.getItem('tempUser') == 'yes') {
      sessionStorage.setItem('deleted', 'yes');
    }
  }


  // Called When form is initialized.
  ngOnInit(): void {

    // Checks if user is logged in and if resumeOption is choosen.
    if (!ValidatorLogin.checkIfUserIsLoggedIn() || sessionStorage.getItem('deleted') == 'yes') {
      this.router.navigate(['']);
    }
    if (!ValidatorLogin.checkIfOptionChoosen()) {
      this.router.navigate(['resumeOption']);
    }
    this.setFormGroup('', '', '', '', '');

    // If editing the resume takes already stored jobs from database to put into list.
    if (sessionStorage.getItem('editing') == 'yes' || this.cameBack) {
      this.auth.getListOfEnteredJobs()
      .subscribe(data => {
          for (let i = 0; i < data.length; i++){
            let jsonData = JSON.parse(this.makeKeysLowercase(data[i]));
            let id = jsonData['id'];
            delete jsonData.userId;
            delete jsonData.id;
            jsonData['checkBox'] = jsonData['endDate'] == this.todayDateString ? true : false;
            this.addToHtmlList(jsonData['companyName'] + " - " + jsonData['position']);
            this.jobList.set(id, jsonData);
          }
          if (this.jobList.size > 0)
            this.jobListViewable = true;
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
    // Removes job from each list.
    this.jobList.delete(Array.from(this.jobList.keys())[index]);
    this.htmlListOfJobs.splice(index, 1);
    this.jobsEntered.splice(index, 1);

    if (this.jobList.size == 0)
      this.jobListViewable = false;
  }

  // Continues to next page
  continueButtonPushed(): void {
    this.router.navigate(['education']);
  }

  // Goes back to previous page.
  goBackButtonPushed(): void {
    sessionStorage.setItem('goBack', 'yes');
    this.workExperienceForm.reset();
    this.router.navigate(['dashboard']);
  }

  // Goes to keyword page.
  keywordPage(): void {
    window.open('/sugestedWordResource', '_blank');
  }
  
}