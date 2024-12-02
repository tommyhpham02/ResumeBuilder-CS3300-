import { FormControl, FormGroup } from "@angular/forms";

// Class for ensuring formgroups that have controls that need validation are validated.
export default class ValidatorForm{
    static validateAllFormFields(formGroup:FormGroup){
        Object.keys(formGroup.controls).forEach(field=>{
          const control = formGroup.get(field);
          if(control instanceof FormControl){
            control.markAsDirty({onlySelf:true})
          }
          else if(control instanceof FormGroup){
            this.validateAllFormFields(control);
          }
        })
      }
}