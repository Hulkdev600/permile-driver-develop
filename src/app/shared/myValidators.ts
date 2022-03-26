import { AbstractControl } from '@angular/forms';


export class MyValidator{

    ValidateSocialNumber(control: AbstractControl){
        if(control.value){}
    }



    validateCell(control : AbstractControl){

        let regPhone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
        console.log(control.value)
        if(regPhone.test(control.value)){
            return true;
        }
        return false

    }
}
