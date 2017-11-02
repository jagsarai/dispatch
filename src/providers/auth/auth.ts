import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

@Injectable()
export class AuthProvider {

  token: any;
  // role: any;
  // email: any;
  // id: any;
  // firstLogin: any;
  // phone: any;
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
            
            this.token = value;
            console.log("This Token: " + this.token);
            let headers = new Headers();
            // this.storage.get("role").then((role) => {
            //   this.role = role;
            //   console.log("Role inside checkAuth", this.role);
            // });
            // this.storage.get("email").then((email) => {
            //   this.email = email;
            // });
            // this.storage.get("id").then((id) => {
            //   this.id = id;
            // });
            // this.storage.get("phone").then((phone) =>{
            //   this.phone = phone;
            // })
            headers.append('Authorization', this.token);

            this.http.get('http://localhost:8000/api/protected', {headers: headers})
                .subscribe(res => {
                    resolve(res);
                }, (err) => {
                    reject(err);
                }); 
        }).catch((err) => {
          console.log(err);
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
            // this.role = data.user.role;
            // this.id = data.user.id;
            // this.email = data.user.email;
            // this.phone = data.user.phone;
            // this.firstLogin = data.user.firstLogin;

            // this.storage.set('token', this.token);
            // this.storage.set('id', this.id);
            // this.storage.set('role', this.role);
            // this.storage.set('email', this.email);
            // this.storage.set('phone', this.phone);
            // this.storage.set('firstLogin', this.firstLogin);
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
            // this.role = data.user.role;
            // this.id = data.user.id;
            // this.email = data.user.email;
            // this.firstLogin = data.user.firstLogin,
            // this.phone = data.user.phone

            this.storage.set('token', this.token);
            // this.storage.set('id', this.id);
            // this.storage.set('role', this.role);
            // this.storage.set('email', this.email);
            // this.storage.set('firstLogin', this.firstLogin);
            // this.storage.set('phone', this.phone);
            this.storage.set('user', data.user);
            console.log("The user is", data.user.role);
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
    
  logout(){
    this.storage.set('token', '');
    // this.storage.set('role', '');
    // this.storage.set('email', '');
    // this.storage.set('id', '');
    // this.storage.set('firstLogin', '');
    this.storage.set('user', '');
  }
    
}
