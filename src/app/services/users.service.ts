import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from './login.service';
import { CookieService } from 'ngx-cookie-service';
import { retry } from 'rxjs/operators';

declare interface usersDataResp {
  status: string;
  status_code: number;
  data: any;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient, private cookieService: CookieService) {
  }

  // Get All Users API //
  getAllUsers() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<usersDataResp>(LoginService.API_Base_URL + '/users?admin_request=1', { headers: headers }).pipe(retry(1));
  }

  // Delete User API //
  deleteUser(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<usersDataResp>(LoginService.API_Base_URL + '/deleteuser', request, { headers: headers }).pipe(retry(1));
  }

  // Get All Page Owners or Merchant Users API //
  getPageOwners() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<usersDataResp>(LoginService.API_Base_URL + '/getpageowners?admin_request=1', { headers: headers }).pipe(retry(1));
  }

  // Get All Web Users API //
  getAllWebUsers() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<usersDataResp>(LoginService.API_Base_URL + '/getwebusers?admin_request=1', { headers: headers }).pipe(retry(1));
  }
  
  // Get All Mobile Users API //
  getAllMobileUsers() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<usersDataResp>(LoginService.API_Base_URL + '/getmobileusers?admin_request=1', { headers: headers }).pipe(retry(1));
  }
}
