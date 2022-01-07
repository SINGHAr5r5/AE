import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { LoadingController, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GlobalDataService } from './globaldata.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/delayWhen';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/onErrorResumeNext';

@Injectable()
export class ServiceHttp {
  public inprogress_requests : Subject<any> = new Subject();
  private requests_active :number = 0;
  loader :any;
  user_api_key:string = "";
  constructor ( private http: HttpClient,public loadingCtrl: LoadingController, private alertCtrl: AlertController) {}
  request(path: String, data, options :any = {}, method): Observable<any> {
    options.headers = new Headers();
    options.headers.append('Content-Type', 'application/x-www-form-urlencoded','Authorization', this.user_api_key);
    // let base_url =   "https://www.myadventureearth.com/api/v3/";
    let base_url =   "https://www.myadventureearth.com/api/v7/";
    let timeout = 120000;
    let max_retries = 3;
    let url = `${base_url}${path}`;
    let body;
    body = {
        LoadMoreLimit: 10, numLoad: 0, width: 414, data: 15
      };
        let Params = new HttpParams({
            fromObject: data
        });
    let request;
    if(method == 'GET'){
        request = this.http.get(url)
        .timeout(timeout)
        .retryWhen((errors) =>
            errors.scan( ( errorCount, err ) => {
                if( errorCount < max_retries && err.name == 'TimeoutError' )
                    return errors.delay(500);
                throw err;
            }, 0)
        );
    }else{
        let count = 0;
        request = this.http.post(url, Params,{
            headers: new HttpHeaders()
              .set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
              .set('Authorization', this.user_api_key)
           })
        .timeout(timeout)
        .retryWhen((errors) =>
            errors.scan( ( errorCount, err ) => {
                if(count < max_retries && err.name == 'HttpErrorResponse' && path != 'Postimg'){
                    count++;
                    return errors.delay(500);
                }
                if( errorCount < max_retries && err.name == 'TimeoutError' ){
                    return errors.delay(500);
                }
                throw err;
            }, 0)
        );
    }
    if(path != 'photos_google' && path != 'saveError'){
    request = request.map(this.extractData);
    request = request.retryWhen( (errors) =>
          errors.delayWhen( (error) => {
              let message = this.log_error(error);

              let datasend = {
                  data : JSON.stringify(data),
                  url: path
              }

              this.request('saveError',datasend,{loading : false},method).subscribe(response => {
              });
              return this.error_handler(message, error);
          })
      );
    }
    if( !options.loading ) {
        this.add_blocking_request();
        request = request.finally( () => this.finish_blocking_request() );
    }

    return request;
  }

  private add_blocking_request() {
    if( this.requests_active++ == 0 ) {
      this.loader = this.loadingCtrl.create({content: 'Please wait...'});
    }
  }

  private finish_blocking_request() {
    if( --this.requests_active == 0 ){
      this.loader.dismiss();
    }
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  private log_error(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {

      let body :any = {};
      try {
        body = error.json() || {};
      } catch(e) {}

      const err = body.error || JSON.stringify(body);
      errMsg = `<img src="./assets/imgs/retry2.png">`;
      if( error.status == 0 ) {
        console.error(errMsg);
        errMsg = `<img src="./assets/imgs/retry2.png">`;
      }
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return errMsg;
  }

  private error_handler(message: Response | string , error: Response | any) {
      let retry_subject = new Subject();
      let retry;

      if( error.status == 401 ) {
          retry = this.alertCtrl.create({
              title: 'Logged Out',
              cssClass: 'errorHttp',
              message: `You have been logged out and need to log in again`,
              enableBackdropDismiss: false,
              buttons: [
                  {
                      text: 'OK',
                      handler: () => {
                          retry_subject.error( error );
                          retry_subject.complete();
                          return false;
                      }
                  },
              ]
          });
      } else {
        let title = 'Server Error';
        let display_message = `<img src="./assets/imgs/retry2.png">`;
                  if( error.status == 400 || error.status == 0 ) {
            display_message = `<img src="./assets/imgs/retry2.png">`;
            title = "Failed To Load Data";
          }
          retry = this.alertCtrl.create({
              title,
              cssClass: 'errorHttp',
              message: display_message,
              enableBackdropDismiss: false,
              buttons: [
                  {
                      text: 'Retry',
                      handler: () => {
                          retry.dismiss();
                          retry_subject.next( 1 );
                          retry_subject.complete();
                          return false;
                      }
                  }
              ]
          });
      }
      retry.present();
      return retry_subject;
  }
}
