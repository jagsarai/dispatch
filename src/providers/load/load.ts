import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthProvider } from '../auth/auth';
import 'rxjs/add/operator/map';

/*
  Generated class for the LoadProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoadProvider {

  constructor(public http: Http, public authService: AuthProvider) {
    console.log('Inside LoadProvider');
  }

  getLoads() {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      let token = this.authService.token;
      console.log(token);
      headers.append('Authorization', token);

      this.http.get('http://localhost:8000/api/loads', {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  createLoad(load){
    
    return new Promise((resolve, reject) => {

      let headers = new Headers();
      let token = this.authService.token;
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', token);

      this.http.post('http://localhost:8000/api/loads', JSON.stringify(load), {headers: headers})
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  deleteLoad(id){
    
    return new Promise((resolve, reject) => {

        let headers = new Headers();
        let token = this.authService.token;
        headers.append('Authorization', token);

        this.http.delete('http://localhost:8000/api/loads/' + id, {headers: headers}).subscribe((res) => {
            resolve(res);
        }, (err) => {
            reject(err);
        });    
    });
  }

}
