import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthProvider } from '../auth/auth';
import 'rxjs/add/operator/map';

/*
  Generated class for the ReceiverProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ReceiverProvider {

  constructor(public http: Http, public authService: AuthProvider) {
    console.log('Hello ReceiverProvider Provider');
  }

  getRecievers(){

    return new Promise((resolve, reject) => {
      let headers = new Headers();
      let token = this.authService.token;
      console.log(token);
      headers.append('Authorization', token);

      this.http.get('http://localhost:8000/api/receivers', {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  retriveReceiver(id){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      let token = this.authService.token;
      console.log(token);
      headers.append('Authorization', token);

      this.http.get('http://localhost:8000/api/receivers/' + id, {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  createReceiver(receiver){
    
    return new Promise((resolve, reject) => {

      let headers = new Headers();
      let token = this.authService.token;
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', token);

      this.http.post('http://localhost:8000/api/receivers', JSON.stringify(receiver), {headers: headers})
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  updateReceiver(receiver){

    return new Promise((resolve, reject) => {

      let headers = new Headers();
      let token = this.authService.token;
      headers.append('Authorization', token);

      this.http.put('http://localhost:8000/api/receivers/' + receiver.id, JSON.stringify(receiver), {headers: headers}).subscribe((res) => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  deleteReceiver(id){
    
    return new Promise((resolve, reject) => {

        let headers = new Headers();
        let token = this.authService.token;
        headers.append('Authorization', token);

        this.http.delete('http://localhost:8000/api/receivers/' + id, {headers: headers}).subscribe((res) => {
            resolve(res);
        }, (err) => {
            reject(err);
        });    
    });
  }

}
