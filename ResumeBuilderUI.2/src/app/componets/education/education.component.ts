import { Component, OnInit, ViewChild } from '@angular/core';
import { CheckboxControlValueAccessor, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidatorForm from '../../helpers/validateForm';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrl: './education.component.css'
})

export class EducationComponent {
  educationForm!: FormGroup;
  degreeList = new Map<number, any>;
  htmlListOfDegrees: string[] = ['', '', ''];
  degreesEntered: Boolean[] = [false, false, false];
  currentDegree: Boolean = false;
  degreeListViewable: Boolean = false;
  editMode: Boolean = false;
  editingResume: Boolean = true;
  degreeIdToEdit: number = -1;
  degreeIndexToEdit: number = -1;

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
    if (this.editingResume) {
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
    // Or if not editing, deletes all jobs associated with the user.
    else {
      this.auth.deleteAllDegrees()
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

  // Adds job to database if form is valid and no more than three already in database.
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

  // Replaces input fields with specified job wanting to edit, removes original from database. 
  editDegree(index: number) {
    let degreeToEdit = this.degreeList.get(Array.from(this.degreeList.keys())[index]);
    this.setFormGroup(degreeToEdit[`college`], degreeToEdit[`cityAndState`], degreeToEdit[`degreeType`], degreeToEdit[`degreeName`],
      degreeToEdit[`yearGraduated`]);

      this.degreeListViewable = false;
      this.editMode = true;
      this.degreeIdToEdit = Array.from(this.degreeList.keys())[index];
      this.degreeIndexToEdit = index;
  }

  // Edits job in the actual database, if the user makes edits and hits the make edits button.
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

  // Saves job to database and adds to appropriate lists.
  saveDegreeToDatbase(value: any) {
    this.auth.submitDegreesInfo(value)
    .subscribe({
      next:(data) => {
        alert("Degree has been saved.");
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

  // Adds job information needed for displaying on frontend.
  addToHtmlList(htmlInsert: string) {
    this.htmlListOfDegrees[this.degreeList.size] = htmlInsert;
    this.degreesEntered[this.degreeList.size] = true;
  }

  // Removes job from database and lists with specified index.
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
    this.degreeList.delete(Array.from(this.degreeList.keys())[index]);
    this.htmlListOfDegrees.splice(index, 1);
    this.degreesEntered.splice(index, 1);

    if (this.degreeList.size == 0)
      this.degreeListViewable = false;
  }

  // Continues to next page
  continueButtonPushed(): void {
      this.educationForm.reset();
      this.router.navigate(['workexperience']);
  }

  // Goes back to previous page.
  goBackButtonPushed(): void {
    this.educationForm.reset();
    this.router.navigate(['education']);
  }
}