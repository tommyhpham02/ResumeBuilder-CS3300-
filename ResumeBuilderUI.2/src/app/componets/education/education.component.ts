import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  degreeList = new Map<number, any>;
  htmlListOfDegree: string[] = ['', '', ''];
  degreeEntered: Boolean[] = [false, false, false];
  currentDegree: Boolean = false;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.educationForm = this.fb.group({
      collegeName: ['', Validators.required],
      collegeCity: ['', Validators.required],
      degreeType: ['', Validators.required],
      collegeDegreeName: ['', Validators.required],
      collegeYear: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      currentDegreeValue: [false] // Default value is false
    });
  }

  onCurrentChange(): void {
    this.currentDegree = !this.currentDegree;
    console.log("Truth Value: " + this.currentDegree);
  }

  addDegree(): void {
    if (this.degreeList.size < 3) {
      if (this.educationForm.valid) {
        if (this.currentDegree)
          this.educationForm.get('currentDegreeValue')?.setValue(true);

        this.saveDegreeToDatabase(this.educationForm.value);

        console.log("List of Degrees: " + "\n" + "--------------" + "\n");
        this.degreeList.forEach(element => {
          console.log(element);
        });
      }
      else {
        const errors = this.getFieldErrors();
        alert("Form is invalid! Please address the following errors:\n\n" + errors.join('\n'));
      }
    }
    else {
      alert("Cannot have more than 3 Degrees!");
    }
  }

// Helper method to gather specific field errors
getFieldErrors(): string[] {
  const errorMessages: string[] = [];
  
  const controls = this.educationForm.controls;

  if (controls['collegeName']?.hasError('required')) {
    errorMessages.push('- College name is required.');
  }
  if (controls['collegeCity']?.hasError('required')) {
    errorMessages.push('- City/State is required.');
  }
  if (controls['degreeType']?.hasError('required')) {
    errorMessages.push('- Degree type is required.');
  }
  if (controls['collegeDegreeName']?.hasError('required')) {
    errorMessages.push('- Degree name is required.');
  }
  if (controls['collegeYear']?.hasError('required')) {
    errorMessages.push('- Graduation year is required.');
  }
  if (controls['collegeYear']?.hasError('invalidYear')) {
    errorMessages.push('- Graduation year must be a 4-digit number.');
  }

  return errorMessages;
}


  editDegree(index: number) {
    this.educationForm = this.degreeList.get(Array.from(this.degreeList.keys())[index]);
    this.removeDegreeWithIndex(index);
  }

  saveDegreeToDatabase(value: any){
    console.log(value);
    this.auth.submitDegreeInfo(value)
    .subscribe({
      next:(data) => {
        this.addToHtmlList(this.educationForm.get('collegeName')?.value + ' - ' + this.educationForm.get('degreeType')?.value)
        this.degreeList.set(data, this.educationForm);
        alert("Degree has been saved.")
        this.educationForm.reset();
        this.currentDegree = false;
      },
      error: (err) => {
        console.error('Full Error Response:', err);
        alert(err?.error.message);
      }
    })
  }

  addToHtmlList(htmlInsert: string) {
    this.htmlListOfDegree[this.degreeList.size] = htmlInsert;
    this.degreeEntered[this.degreeList.size] = true;
    console.log(this.htmlListOfDegree, this.degreeEntered); // Debug log
  }

  removeDegreeWithIndex(index: number) {
    this.auth.deleteDegree(Array.from(this.degreeList.keys())[index])
    .subscribe({
      next:(res) => {
        alert(res.message)
      },
      error: (err) => {
        console.error('Full Error Response:', err);
        alert(err?.error.message);
      }
    })
    this.degreeList.delete(Array.from(this.degreeList.keys())[index]);
    this.htmlListOfDegree.splice(index, 1);
    this.degreeEntered.splice(index, 1);
  }

  continueButtonPushed(){
    if (this.degreeList.size >= 1) {
      this.educationForm.reset();
      this.router.navigate(['download']);
    }
    else {
      alert("No Degrees entered. Proceeding")
      this.router.navigate(['download']);
    }
  }
}
