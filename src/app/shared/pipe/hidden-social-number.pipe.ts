import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hiddenSocialNumber'
})
export class HiddenSocialNumberPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string | null {
    if(!value)
      return null;

    if(value.length==13){
      return value.substring(0,6) + ' - ' + '•••••••'
    } else {
      return 'ERROR'
    }
  }

}
