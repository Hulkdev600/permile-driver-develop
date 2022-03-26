import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export class MyValidator{

    static validateCell():ValidatorFn | null {
        return (control:AbstractControl): ValidationErrors | null => {
            let regPhone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
            let cell = control.value

            if(regPhone.test(cell)){
                return null;
            }
            return {'invalidCell' : true}
        }
        
    }

    static validSocialNumber():ValidatorFn | null {
        return (control:AbstractControl): ValidationErrors | null => {
            let rn = control.value;
            
            rn = rn.split("-").join('');
            // if( rn.length !== 13 ) return false;
            if( rn.length !== 13 ) return { 'invalidSocialNumber' : true}; // 13자리가 안될때 invalid 상태
         
            var checkSum = 0;
            for(var i=0; i<12; i++) checkSum += ((rn.substr(i,1)>>0)*((i%8)+2));
         
            var rrnMatch = (11-(checkSum%11))%10 == rn.substr(12,1);
            var frnMatch = (13-(checkSum%11))%10 == rn.substr(12,1);
         
            if((rrnMatch || frnMatch)){
                return null
            } else {
                return {'invaliSocialNumber' : true}
            }
            // if( type === 'rrn' ) return rrnMatch;
            // else if( type === 'frn' ) return frnMatch; 
            // else return rrnMatch || frnMatch;
        }
        
    }

}
