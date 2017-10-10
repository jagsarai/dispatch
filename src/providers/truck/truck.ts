import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthProvider } from '../auth/auth';
import 'rxjs/add/operator/map';

/*
  Generated class for the TruckProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TruckProvider {
  trucks: any;
  truckNumbers: any;

  constructor(public http: Http, public authService: AuthProvider) {
    console.log('Hello TruckProvider Provider');
  }

  // mapTruckNumbers(truckData){
  //   return truckData.map((truck) => {
  //      return {
  //        number: truck.number.toString()
  //      }
  //   });
  // }

  // filterTruckNumbers(searchTerm){
  //   return this.truckNumbers.filter((truck) => {
  //       return truck.number.indexOf(searchTerm) > -1;
  //   });    
  // }

  getTrucks(){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      let token = this.authService.token;
      console.log(token);
      headers.append('Authorization', token);

      this.http.get('http://172.20.10.5:8000/api/trucks', {headers: headers})
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
      console.log(token);
      headers.append('Authorization', token);

      this.http.get('http://172.20.10.5:8000/api/trucks/' + id, {headers: headers})
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

      this.http.post('http://172.20.10.5:8000/api/trucks', JSON.stringify(truck), {headers: headers})
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

      this.http.put('http://172.20.10.5:8000/api/trucks/' + truck.id, JSON.stringify(truck), {headers: headers}).subscribe((res) => {
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

        this.http.delete('http://172.20.10.5:8000/api/trucks/' + id, {headers: headers}).subscribe((res) => {
            resolve(res);
        }, (err) => {
            reject(err);
        });    
    });
  }

}
