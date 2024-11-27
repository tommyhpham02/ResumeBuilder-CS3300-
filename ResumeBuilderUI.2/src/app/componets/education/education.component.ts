import { Component, OnInit } from '@angular/core';
import { CheckboxControlValueAccessor, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidatorForm from '../../helpers/validateForm';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent {
  educationForm!: FormGroup;
  degreeList = new Map<number, any>();
  htmlListOfDegrees: string[] = ['', '', ''];
  degreesEntered: Boolean[] = [false, false, false];
  currentDegree: Boolean = false;
  degreeListViewable: Boolean = false;
  editMode: Boolean = false;
  degreeIdToEdit: number = -1;
  degreeIndexToEdit: number = -1;
  editingResume: Boolean = true;

  displayString: string = 'display:block;';
  hideString: string = 'display:none;';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {

    const userLoggedIn = sessionStorage.getItem('userId');

    if (userLoggedIn == '' || userLoggedIn === '-1') {
      this.router.navigate(['login']);
    
  }

    this.setFormGroup('', '', '', '', '');

    // If editing the resume (set up variable later) takes already stored degrees from database to put into list
    if (this.editingResume) {
      this.auth.getListOfEnteredDegrees()
      .subscribe(data => {
          for (let i = 0; i < data.length; i++){
            let jsonData = JSON.parse(data[i]);
            let id = jsonData['id'];
            delete jsonData.userId;
            delete jsonData.id;
            this.addToHtmlList(jsonData['College'] + " - " + jsonData['DegreeName']);
            this.degreeList.set(id, jsonData)
            console.log(this.degreeList.get(id));
          }
          if (this.degreeList.size > 0)
            this.degreeListViewable = true;
      });
  }
  // Or if not editing, deletes all degree associated with the user.
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


  setFormGroup(name: string, city: string, type: string, degree: string, year: string): void {
    this.educationForm = this.fb.group({
      College: [name, Validators.required],
      CityAndState: [city, Validators.required],
      degreeType: [type, Validators.required],
      DegreeName: [degree, Validators.required],
      YearGraduated: [year, [Validators.required, Validators.pattern(/^\d{4}$/)]]
    });
    
  }

  addDegree(): void {
    if (this.degreeList.size < 3) {
      if (this.educationForm.valid) {
        if (!this.degreeListViewable)
          this.degreeListViewable = false;

        this.saveDegreeToDatabase(this.educationForm.value)
      }
      else {
        alert("Form is invalid!")
      }
    }
    else {
      alert("Cannot have more than 3 jobs!");
    }
  }
  editDegree(index: number): void {
    let degreeToEdit = this.degreeList.get(Array.from(this.degreeList.keys())[index]);
    this.setFormGroup(
      degreeToEdit['College'],
      degreeToEdit['CityAndState'],
      degreeToEdit['DegreeType'],
      degreeToEdit['DegreeName'],
      degreeToEdit['YearGraduated']
    );

    this.degreeListViewable = false;
    this.editMode = true;
    this.degreeIdToEdit = Array.from(this.degreeList.keys())[index];
    this.degreeIndexToEdit = index;
  }

  editDegreeInDatabase(): void {
    if ((JSON.stringify(this.educationForm.value) != JSON.stringify(this.degreeList.get(this.degreeIdToEdit))) && this.educationForm.valid){
      this.auth.editDegree(this.educationForm.value, this.degreeIdToEdit)
      .subscribe({
          next: (res) => {
            alert(res.message);
            this.htmlListOfDegrees[this.degreeIndexToEdit] = `${this.educationForm.value.College} - ${this.educationForm.value.degreeType}`;
            this.degreeList.set(this.degreeIdToEdit, this.educationForm.value);
            this.resetEditValues();
          },
          error: (err) => {
            alert(err?.error.message);
          }
        });
    } else {
      alert('Form is invalid');
    }
  }

  saveDegreeToDatabase(value: any): void {
    console.log("Submitting payload to backend:", value);
  
    this.auth.submitDegreeInfo(value).subscribe({
      next: (data) => {
        console.log("Backend response:", data);
        console.log("Backend response:", data.Degree);
  
        // // Validate response structure
        // if (!data || !data.Degree) {
        //   console.error("Invalid response from backend:", data);
        //   alert("Error: Could not save the degree. Invalid backend response.");
        //   return;
        // }
  
        //const savedDegree = data.Degree;
  
        // Add the saved degree to the list using its backend-provided ID
        this.addToHtmlList(this.educationForm.controls['College'].value + ' - ' + this.educationForm.controls['DegreeType'].value);
        this.degreeList.set(data, value);
  
        // Reset the form
        this.setFormGroup('', '', '', '', '');
        this.currentDegree = false;
      },
      error: (err) => {
        console.error("Error response from backend:", err);
        if (err?.error?.errors) {
          console.error("Validation errors:", err.error.errors);
          alert('Validation errors: ' + JSON.stringify(err.error.errors));
        } else {
          alert(err?.error.message || "An error occurred while saving the degree.");
        }
      }
    });
  }
  
  

  // For if user hits the cancel button while editing, does nothing, just resets the form and necessary boolean values.
  cancelEdit(): void {
    this.setFormGroup('', '', '', '', '');
    this.resetEditValues();
  }

  // Adds job information needed for displaying on frontend.
  addToHtmlList(htmlInsert: string) {
    this.htmlListOfDegrees[this.degreeList.size] = htmlInsert;
    this.degreesEntered[this.degreeList.size] = true;
  }

  removeDegreeWithIndex(index: number): void {
    console.log(this.degreeList.get(Array.from(this.degreeList.keys())[index]))
    this.auth.deleteJob(Array.from(this.degreeList.keys())[index])
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

  resetEditValues(): void {
    this.educationForm.reset();
    this.editMode = false;
    this.degreeListViewable = true;
    this.degreeIdToEdit = -1;
    this.degreeIndexToEdit = -1;
  }

  continueButtonPushed(): void {
    if (this.degreeList.size >= 1) {
      this.router.navigate(['download']);
    } else {
      alert('No degrees entered. Proceeding');
      this.router.navigate(['download']);
    }
  }
  goBackButtonPushed(): void {
    this.educationForm.reset(); // Reset the form
    this.router.navigate(['skills']); // Navigate to the "skills" page or any previous step
  }
}