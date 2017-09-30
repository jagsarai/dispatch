import { Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';
import { AuthProvider } from '../auth/auth';
import 'rxjs/add/operator/map';

/*
  Generated class for the DriverProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DriverProvider {

  constructor(public http: Http, public authService: AuthProvider) {
    console.log('Hello DriverProvider Provider');
  }

  getDrivers(role){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      let token = this.authService.token;
      headers.append('Authorization', token);

      this.http.get('http://localhoast:8000/api/users/' + role, {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) =>{
          reject(err);
        });
    });
  }

  createDriver(driver){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      let token = this.authService.token;
      headers.append('Authorization', token);

      this.http.post('http://localhoast:8000/api/users/', JSON.stringify(driver), {headers: headers})
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) =>{
          reject(err);
        });
    });
  }

  updateDriver(driver){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      let token = this.authService.token;
      headers.append('Authorization', token);

      this.http.put('http://localhoast:8000/api/users/' + driver.id, JSON.stringify(driver), {headers: headers}).subscribe(res => {
          resolve(res);
        }, (err) =>{
          reject(err);
        });
    });
  }

  deleteDriver(id){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      let token = this.authService.token;
      headers.append('Authorization', token);

      this.http.delete('http://localhoast:8000/api/users/' + id, {headers: headers}).subscribe(res => {
          resolve(res);
        }, (err) =>{
          reject(err);
        });
    });
  }

}
