import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthProvider } from '../auth/auth';
import 'rxjs/add/operator/map';

@Injectable()
export class TruckProvider {
  trucks: any;
  truckNumbers: any;

  constructor(public http: Http, public authService: AuthProvider) {
  }

  getTrucks(){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      let token = this.authService.token;
      
      headers.append('Authorization', token);

      this.http.get('http://localhost:8000/api/trucks', {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          // this.truckNumbers = this.mapTruckNumbers(data);
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  retriveTruck(id){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      let token = this.authService.token;
      
      headers.append('Authorization', token);

      this.http.get('http://localhost:8000/api/trucks/' + id, {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  createTruck(truck){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      let token = this.authService.token;
      
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', token);

      this.http.post('http://localhost:8000/api/trucks', JSON.stringify(truck), {headers: headers})
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  updateTruck(truck){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      let token = this.authService.token;

      headers.append('Authorization', token);

      this.http.put('http://localhost:8000/api/trucks/' + truck.id, JSON.stringify(truck), {headers: headers}).subscribe((res) => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  deleteTruck(id){
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        let token = this.authService.token;
        
        headers.append('Authorization', token);

        this.http.delete('http://localhost:8000/api/trucks/' + id, {headers: headers}).subscribe((res) => {
            resolve(res);
        }, (err) => {
            reject(err);
        });    
    });
  }

}
