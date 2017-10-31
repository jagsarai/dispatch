import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthProvider {

  token: any;
  role: any;
  email: any;
  id: any;

  tokenValue = (value) => {
    value = value.replace(/[A-Z][A-Z][A-Z]\s/g, "");
    return value;
  };

  constructor(public http: Http, public storage: Storage) {
    
  }

  checkAuthentication(){
    return new Promise((resolve, reject) => {
        //Load token if exists
        this.storage.get('token').then((value) => {
            
            this.token = value;
            console.log("This Token: " + this.token);
            let headers = new Headers();
            this.storage.get("role").then((role) => {
              this.role = role;
              console.log("Role inside checkAuth", this.role);
            });
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

    return new Promise((resolve, reject) => {
        let headers = new Headers();
        
        headers.append('Content-Type', 'application/json');
        //To test on ios device we must link to local database with ip address
        this.http.post('http://localhost:8000/api/register', JSON.stringify(details), {headers: headers})
          .subscribe(res => {
            let data = res.json();
            this.token = 'Bearer ' + this.tokenValue(data.token);
            this.role = data.user.role;
            this.id = data.user.id;
            this.email = data.user.email;

            this.storage.set('token', this.token);
            this.storage.set('id', this.id);
            this.storage.set('role', this.role);
            this.storage.set('email', this.email);

            resolve(data);
          }, (err) => {
            reject(err.json().error)
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
            this.role = data.user.role;
            this.id = data.user.id;
            this.email = data.user.email;

            this.storage.set('token', this.token);
            this.storage.set('id', this.id);
            this.storage.set('role', this.role);
            this.storage.set('email', this.email);

            resolve(data);
          }, (err) => {
            reject(err);
          });
    });
  }

  resetPassword(email){
    return new Promise((resolve, reject) => {
      
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post('http://localhost:8000/api/users/forgot', JSON.stringify(email), {headers: headers})
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }
    
  logout(){
    this.storage.set('token', '');
    this.storage.set('role', '');
    this.storage.set('email', '');
    this.storage.set('id', '');
  }
    
}
