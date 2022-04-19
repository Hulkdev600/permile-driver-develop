import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateDot'
})
export class DateDotPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string | null {
    if(!value)
    return null;

    if(value.length==8){
      return value.substring(0,4) + '.' + value.substring(4,6) +'.'+ value.substring(6,8)
    } else {
      return 'ERROR'
    }
  }

}
