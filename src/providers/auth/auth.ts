import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthProvider {

  public token: any;

  constructor(public http: Http, public storage: Storage) {
    console.log('Hello AuthProvider Provider');
  }

  checkAuthentication(){
       return new Promise((resolve, reject) => {
           //Load token if exists
           this.storage.get('token').then((value) => {
    
               this.token = 'Bearer ' + value;
    
               let headers = new Headers();
               headers.append('Authorization', this.token);
    
               this.http.get('http://localhost:8000/api/protected', {headers: headers})
                   .subscribe(res => {
                       resolve(res);
                   }, (err) => {
                       reject(err);
                   }); 
           });         
    
       });
  }
    
  createAccount(details){

    console.log("Name inside the create Account method: " + details.name);
    console.log("Email inside the create Account method: " + details.email);
    console.log("Phone inside the create Account method: " + details.phone);
    console.log("Password inside the create Account method: " + details.password);
    console.log("Role inside the create Account method: " + details.role);

    return new Promise((resolve, reject) => {
      var response;
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post('http://localhost:8000/api/register', JSON.stringify(details), {headers: headers})
          .subscribe(res => {
            response = res;
            let data = res.json();
            this.token = data.token;
            this.storage.set('token', data.token);
            resolve(data);

          },(err) => {
            alert(response.json())
            reject(err);
          });
    });
  }
    
  login(credentials){

    return new Promise((resolve, reject) => {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post('http://localhost:8000/api/login', JSON.stringify(credentials), {headers: headers})
          .subscribe(res => {

            let data = res.json();
            this.token = data.token;
            this.storage.set('token', data.token);
            resolve(data);

            resolve(res.json());
          }, (err) => {
            reject(err);
          });
    });
  }
    
  logout(){
    this.storage.set('token', '');
  }
    
}
