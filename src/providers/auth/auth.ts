import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthProvider {

  token: any;
  tokenValue = (value) => {
    value = value.replace(/[A-Z][A-Z][A-Z]\s/g, "");
    console.log("New Value is: " + value);
    return value;
  };

  constructor(public http: Http, public storage: Storage) {
    console.log('Inside AuthProvider');
  }

  checkAuthentication(){
    return new Promise((resolve, reject) => {
        //Load token if exists
        this.storage.get('token').then((value) => {
            
            this.token = value;
            console.log("This Token: " + this.token);
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
            this.token = 'Bearer ' + this.tokenValue(data.token);

            this.storage.set('token', this.token);
            this.storage.set('id', data.user.id);
            console.log("userId inside register: " + data.user.id);
            this.storage.set('role', data.user.role);
            console.log("role inside register: " + data.user.role);
            this.storage.set('email', data.user.email);
            console.log("user email inside register: " + data.user.email);
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
            this.token = 'Bearer ' + this.tokenValue(data.token);
            console.log("Token in login " + this.token);

            this.storage.set('token', this.token);
            this.storage.set('id', data.user.id);
            console.log("userId inside login: " + data.user.id);
            this.storage.set('role', data.user.role);
            console.log("role inside login: " + data.user.role);
            this.storage.set('email', data.user.email);
            console.log("user email inside login: " + data.user.email);
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
