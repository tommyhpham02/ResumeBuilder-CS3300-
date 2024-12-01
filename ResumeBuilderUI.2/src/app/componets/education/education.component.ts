import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { CheckboxControlValueAccessor, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidatorForm from '../../helpers/validateForm';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationStart } from '@angular/router';
import ValidatorLogin from '../../helpers/validateLoginAndOptionChoosen';
import { AppClosingService } from '../../services/appClosing.service';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrl: './education.component.css'
})

export class EducationComponent {
  // Form vales as well as boolean flags trigged by events.
  // Also holds list of information of each job, and list of if a job has been entered.
  educationForm!: FormGroup;
  degreeList = new Map<number, any>;
  htmlListOfDegrees: string[] = ['', '', ''];
  degreesEntered: Boolean[] = [false, false, false];
  currentDegree: Boolean = false;
  degreeListViewable: Boolean = false;
  editMode: Boolean = false;
  editingResume: Boolean = true;
  cameBack: Boolean = sessionStorage.getItem('goBack') == 'yes' ? true: false;
  degreeIdToEdit: number = -1;
  degreeIndexToEdit: number = -1;

  displayString: string = "display:block;";
  hideString: string = "display:none;";
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private closer: AppClosingService) {}

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: BeforeUnloadEvent) {
    if (sessionStorage.getItem('tempUser') == 'yes') {
      this.closer.handleAppClosing();
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('tempUser');
      this.router.navigate(['']);
    }
  }

  // Called when form is initialized.
  ngOnInit(): void {
    // Checks if the User is logged in and resumeOption is choosen.
    if (!ValidatorLogin.checkIfUserIsLoggedIn()) {
      this.router.navigate(['']);
    }
    if (!ValidatorLogin.checkIfOptionChoosen()) {
      this.router.navigate(['resumeOption']);
    }
    this.setFormGroup('', '', '', '', '');

    // If editing the resume takes already stored degrees from database to put into list
    if (sessionStorage.getItem('editing') == 'yes' || this.cameBack) {
      this.auth.getListOfEnteredDegrees()
      .subscribe(data => {
          for (let i = 0; i < data.length; i++){
            let jsonData = JSON.parse(this.makeKeysLowercase(data[i]));
            let id = jsonData['id'];
            delete jsonData.userId;
            delete jsonData.id;
            this.addToHtmlList(jsonData['college'] + " - " + jsonData['degreeType']);
            this.degreeList.set(id, jsonData)
            console.log(this.degreeList.get(id));
          }
          if (this.degreeList.size > 0)
            this.degreeListViewable = true;
      });
    }
  }

  // Sets the form to have certain values as well as the checkbox
  setFormGroup(college: string, city: string, type: string, name: string, year: string) : void {
    this.educationForm = this.fb.group({
      college: [college, Validators.required],
      cityAndState: [city, Validators.required],
      degreeType: [type, Validators.required],
      degreeName: [name, Validators.required],
      yearGraduated: [year, Validators.required],
    });
  }

  // When recieving from the API, takes the string and replaces capitalized letters with lowercase ones in JSON string.
  makeKeysLowercase(jsonData: string): string {
    jsonData = jsonData.replace("\"Id\":", "\"id\":");
    jsonData = jsonData.replace("\"UserId\":", "\"userId\":");
    jsonData = jsonData.replace("\"College\":", "\"college\":");
    jsonData = jsonData.replace("\"CityAndState\":", "\"cityAndState\":");
    jsonData = jsonData.replace("\"DegreeType\":", "\"degreeType\":");
    jsonData = jsonData.replace("\"DegreeName\":", "\"degreeName\":");
    jsonData = jsonData.replace("\"YearGraduated\":", "\"yearGraduated\":");

    return jsonData;
  }

  // Adds degree to database if form is valid and no more than three already in database.
  addDegree(): void {
    if (this.degreeList.size < 3) {
      if (this.educationForm.valid) {
        if (!this.degreeListViewable)
          this.degreeListViewable = true;

        this.saveDegreeToDatbase(this.educationForm.value)
      }
      else {
        alert("Form is invalid!")
      }
    }
    else {
      alert("Cannot have more than 3 degrees!");
    }
  }

  // Replaces input fields with specified degree wanting to edit, removes original from database. 
  editDegree(index: number) {
    let degreeToEdit = this.degreeList.get(Array.from(this.degreeList.keys())[index]);
    this.setFormGroup(degreeToEdit[`college`], degreeToEdit[`cityAndState`], degreeToEdit[`degreeType`], degreeToEdit[`degreeName`],
      degreeToEdit[`yearGraduated`]);
      this.degreeListViewable = false;
      this.editMode = true;
      this.degreeIdToEdit = Array.from(this.degreeList.keys())[index];
      this.degreeIndexToEdit = index;
  }

  // Edits degree in the actual database, if the user makes edits and hits the make edits button.
  editDegreeInDatabase(): void {
    if ((JSON.stringify(this.educationForm.value) != JSON.stringify(this.degreeList.get(this.degreeIdToEdit))) && this.educationForm.valid){
      this.auth.editDegree(this.educationForm.value, this.degreeIdToEdit)
      .subscribe({
        next:(res) => {
          alert(res.message);
          this.htmlListOfDegrees.splice(this.degreeIndexToEdit, 1, 
            this.educationForm.controls['college'].value + ' - ' + this.educationForm.controls['degreeType'].value);
          this.degreeList.set(this.degreeIdToEdit, this.educationForm.value);
          this.setFormGroup('', '', '', '', '');
          this.resetEditValues();
        },
        error: (err) => {
          console.error('Full Error Response:', err);
          alert(err?.error.message);
        }
      });
    }
    else if (JSON.stringify(this.educationForm.value) == JSON.stringify(this.degreeList.get(this.degreeIdToEdit))) {
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
    this.currentDegree = false;
    this.editMode = false;
    this.degreeListViewable = true;
    this.degreeIdToEdit = -1;
    this.degreeIndexToEdit = -1; 
  }

  // Saves degree to database and adds to appropriate lists.
  saveDegreeToDatbase(value: any) {
    this.auth.submitDegreesInfo(value)
    .subscribe({
      next:(data) => {
        console.log("Degree has been saved.");
        this.addToHtmlList(this.educationForm.controls['college'].value + ' - ' + this.educationForm.controls['degreeType'].value)
        this.degreeList.set(data, value);
        this.setFormGroup('', '', '', '', '');
        this.currentDegree = false;
      },
      error: (err) => {
        console.error('Full Error Response:', err);
        alert(err?.error.message);
      }
    });
  }

  // Adds degree information needed for displaying on frontend.
  addToHtmlList(htmlInsert: string) {
    this.htmlListOfDegrees[this.degreeList.size] = htmlInsert;
    this.degreesEntered[this.degreeList.size] = true;
  }

  // Removes degree from database and lists with specified index.
  removeDegreeWithIndex(index: number): void {
    console.log(this.degreeList.get(Array.from(this.degreeList.keys())[index]))
    this.auth.deleteDegree(Array.from(this.degreeList.keys())[index])
    .subscribe({
      next:(res) => {
        console.log(res.message)
      },
      error: (err) => {
        console.error('Full Error Response:', err);
        alert(err?.error.message);
      }
    })
    // Removes degree from each list.
    this.degreeList.delete(Array.from(this.degreeList.keys())[index]);
    this.htmlListOfDegrees.splice(index, 1);
    this.degreesEntered.splice(index, 1);

    if (this.degreeList.size == 0)
      this.degreeListViewable = false;
  }

  // Continues to next page
  continueButtonPushed(): void {
    if (this.degreeList.size >= 1) {
      this.educationForm.reset();
      this.router.navigate(['skills']);
    }
    else {
      alert("No degrees entered. Proceeding")
      this.router.navigate(['skills']);
    }
  }

  // Goes back to previous page.
  goBackButtonPushed(): void {
    sessionStorage.setItem('goBack', 'yes');
    this.educationForm.reset();
    this.router.navigate(['workexperience']);
  }

  keywordPage(): void {
    window.open('/sugestedWordResource', '_blank');
  }
}