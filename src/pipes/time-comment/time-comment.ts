import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the TimeCommentPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'timeComment',
})
export class TimeCommentPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value, ...args) {
    var difference = Date.now() - value;
    var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
    difference -= daysDifference * 1000 * 60 * 60 * 24
    var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
    difference -= hoursDifference * 1000 * 60 * 60
    var minutesDifference = Math.floor(difference / 1000 / 60);
    difference -= minutesDifference * 1000 * 60
    var secondsDifference = Math.floor(difference / 1000);
    console.log('difference = ' + daysDifference + ' day ' + hoursDifference + ' hour ' + minutesDifference + ' minute' + secondsDifference + ' second ')
    if(minutesDifference == 0){
      minutesDifference = 1;
    }
    if(daysDifference > 0){
      return daysDifference + " day";
    }else if(hoursDifference > 0){
      return hoursDifference + " hours";
    }else{
      return minutesDifference + " minutes";
    }
    
  }
}
