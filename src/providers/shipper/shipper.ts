import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthProvider } from '../auth/auth';
import 'rxjs/add/operator/map';

@Injectable()
export class ShipperProvider {

  constructor(public http: Http, public authService: AuthProvider) {
  }

  getShippers(){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      let token = this.authService.token;
      console.log(token);
      headers.append('Authorization', token);

      this.http.get('http://localhost:8000/api/shippers', {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  retriveShipper(id){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      let token = this.authService.token;
    
      headers.append('Authorization', token);

      this.http.get('http://localhost:8000/api/shippers/' + id, {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  createShipper(shipper){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      let token = this.authService.token;

      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', token);

      this.http.post('http://localhost:8000/api/shippers', JSON.stringify(shipper), {headers: headers})
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  updateShipper(shipper){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      let token = this.authService.token;

      headers.append('Authorization', token);

      this.http.put('http://localhost:8000/api/shippers/' + shipper.id, JSON.stringify(shipper), {headers: headers}).subscribe((res) => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  deleteShipper(id){
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        let token = this.authService.token;
        
        headers.append('Authorization', token);

        this.http.delete('http://localhost:8000/api/shippers/' + id, {headers: headers}).subscribe((res) => {
            resolve(res);
        }, (err) => {
            reject(err);
        });    
    });
  }

}
