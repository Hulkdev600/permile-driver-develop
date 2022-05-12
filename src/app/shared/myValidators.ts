import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export class MyValidator{

    static validateCell():ValidatorFn | null {
        return (control:AbstractControl): ValidationErrors | null => {
            // let regPhone = /^01([0|1|6|7|8|9])(\s-\s)?([0-9]{3,4})(\s-\s)?([0-9]{4})$/;
            let regPhone = /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/;
            let cell = control.value

            if(!cell){
                return null;
            }

            if(regPhone.test(cell)){
                return null;
            }
            return {'invalidCell' : true}
        }
        
    }

    static validSocialNumber2(socialNumberFirst:string, socialNumberSecond:string):ValidatorFn | null {
        return (controls:AbstractControl) : ValidationErrors | null => {
            const firstControl = controls.get(socialNumberFirst);
            const secondControl = controls.get(socialNumberSecond);

            // console.log(firstControl)
            // console.log(secondControl)
            const rnFirst = String(firstControl!.value);
            const rnSecond = String(secondControl!.value);

            
            const rnFinal = rnFirst + rnSecond
            
            // console.log('rnFinal : ', rnFinal)
            if( rnFinal.length!==0 && rnFinal.length !== 13 ) {
                // controls.get(socialNumberFirst)!.setErrors({ invalidSocialNumber: true });
                // controls.get(socialNumberSecond)!.setErrors({ invalidSocialNumber: true });
                // return { invalidSocialNumber : true }; // 13자리가 안될때 invalid 상태
            
                return { invalidSocialNumber: true }
                
            } else {

                // 주민등록번호 첫번쨰 driverSocialNumberFirst만 error null처리한다.
                firstControl?.setErrors(null)
                // secondControl?.setErrors(null) // 이것까지해버리면 아예 invalid 풀려버려서 주석처리해야된다.

                return null
            }
            
            
        }
    }

    static validSocialNumber():ValidatorFn | null {
        return (control:AbstractControl): ValidationErrors | null => {
            let rn = control.value;
            
            rn = rn.split("-").join('');
            
            if( rn.length !== 13 ) return { 'invalidSocialNumber' : true}; // 13자리가 안될때 invalid 상태
         
            //테스트용 return null 추가
            return null

            /** 원상태 **/
            // var checkSum = 0;
            // for(var i=0; i<12; i++) checkSum += ((rn.substr(i,1)>>0)*((i%8)+2));
         
            // var rrnMatch = (11-(checkSum%11))%10 == rn.substr(12,1);
            // var frnMatch = (13-(checkSum%11))%10 == rn.substr(12,1);
         
            // if((rrnMatch || frnMatch)){
            //     return null
            // } else {
            //     return {'invaliSocialNumber' : true}
            // }
           
        }
        
    }

    

}
