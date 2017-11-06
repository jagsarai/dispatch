import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

@Injectable()
export class AuthProvider {

  token: any;
  user: any;

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
            //set returned data to local var. 
            this.token = value;
            let headers = new Headers();
            headers.append('Authorization', this.token);
            //make authentication request to backend. 
            this.http.get('http://localhost:8000/api/protected', {headers: headers})
                .subscribe(res => {
                    resolve(res);
                }, (err) => {
                    reject(err);
                }); 
        }).catch((err) => {
          //do nothing
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
            this.user = data.user;

            this.storage.set('user', this.user);
            this.storage.set('token', this.token);

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
            this.user = data.user
            //set local storage objects with user object and token.
            this.storage.set('token', this.token);
            this.storage.set('user', data.user);
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

        this.http.post('http://localhost:8000/api/users/forgot_password', JSON.stringify(email), {headers: headers})
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

  changePassword(user){
    return new Promise((resolve, reject) => {
      this.checkAuthentication().then(() => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', this.token);

        this.http.post('http://localhost:8000/api/users/change_password', JSON.stringify(user), {headers: headers})
          .subscribe(res => {

            let data = res.json();
            this.user = data.user

            this.storage.set('user', data.user);
            resolve(data);
          }, (err) => {
            reject(err);
          });
      }).catch((err) => {
        //do nothing.
      });
    })
  }
    
  logout(){
    //set all our local storage objects to empty
    this.storage.set('token', '');
    this.storage.set('user', '');
  }
    
}
