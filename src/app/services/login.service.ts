import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

export interface LoggedInUserData {
  id: string;
  email: string;
  mobile: string;
  nick_name: string;
  token: string;
}

export interface LoginResponseCongif {
  status: string;
  message: string;
  status_code: string;
  data: LoggedInUserData;
}

export interface resetPasswordCongif {
  status: string;
  message: string;
  status_code: number;
}

export interface LogoutRespConfig {
  status: string;
  status_code: number;
  message: string;
}
export interface NotificationRespConfig {
  status: string;
  status_code: number;
  message: string;
  data: any;
  notification_unread_count: any;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // public static API_Base_URL = "http://13.232.239.29/api/v1";
  public static API_Base_URL = "https://watnew.com/rest/api/v1";

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  loginAuthentication(request: any) {
    return this.http.post<LoginResponseCongif>(LoginService.API_Base_URL + '/login', request).pipe(retry(1));
  }

  reset_password(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<resetPasswordCongif>(LoginService.API_Base_URL + '/resetAdminPassword', request, { headers }).pipe(retry(1));
  }

  getNotifications() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<NotificationRespConfig>(LoginService.API_Base_URL + '/getuserpushnotifications', { headers }).pipe(retry(1));
  }

  getmorenotifications(res) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<NotificationRespConfig>(res, { headers }).pipe(retry(1));
  }

  //Notification Read all //
  markallread() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<NotificationRespConfig>(LoginService.API_Base_URL + '/updateuserallpushnotifications', {
      headers: headers
    }).pipe(retry(1));
  }

  logoutUser() {
    let token = JSON.parse(this.cookieService.get('barrierToken'));
    return this.http.get<LogoutRespConfig>(LoginService.API_Base_URL + '/logout/' + token).pipe(retry(1));
  }
}
