import { Pipe, PipeTransform } from '@angular/core';
import { GlobalDataService } from '../..//services/globaldata.service';
import { ServiceFactoryThread } from '../../services/ServiceFactoryThread';

/**
 * Generated class for the ImageCommentPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'imageComment',
})
export class ImageCommentPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  constructor(public gd: GlobalDataService, public serviceFactoryThread: ServiceFactoryThread) {
  }
  transform(value: string, args) {
    let url = "";
    if (this.gd.likeUser.map((el) => el.user_id).indexOf(value) == '-1') {
      let datasend = {
        "idUser": value
      }
      this.serviceFactoryThread.ServiceThread("imgComment", datasend, "POST").then(data => {
        data["res_result"].forEach(element => {
          this.gd.likeUser.push(element);
          url = element["user_photo"];
        });
      })
    } else {
      this.gd.likeUser.filter(data => {
        if (data.user_id === value) {
          url = data.user_photo;
        }
      });
    }
    return url;
  }
}
