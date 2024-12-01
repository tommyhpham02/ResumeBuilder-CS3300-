import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";

export default class ValidatorLogin {

    // Function for ensuring the user is actually logged in and has choosen an option for their resume.
    static checkIfUserIsLoggedIn(): Boolean {
        const userLoggedIn = sessionStorage.getItem('userId');
        let loggedIn = true;

        // If there is no user ID in the session storage.
        if (userLoggedIn == '' || userLoggedIn == '-1' || userLoggedIn == null) {
            loggedIn = false;
        }

        return loggedIn;
    }

    static checkIfOptionChoosen(): Boolean {
        const editing = sessionStorage.getItem('editing');
        const temp = sessionStorage.getItem('tempUser');
        let optionChoosen = true;

        if (editing == null && temp == null) {
            optionChoosen = false;
        }

        return optionChoosen;
    }
}
