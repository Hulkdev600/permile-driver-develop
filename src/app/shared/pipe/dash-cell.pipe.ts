import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dashCell'
})
export class DashCellPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string | null {
    if(!value)
      return null;

    if(value.length==10){
      let returnVal = value.substring(0,3) + ' - ' + value.substring(3,6) + ' - ' + value.substring(6)
      return returnVal
    } else if(value.length ==11) {
      let returnVal = value.substring(0,3) + ' - ' + value.substring(3,7) + ' - ' + value.substring(7)
      return returnVal
    } else {
      return 'ERROR'
    }
  }

}
