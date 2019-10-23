import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from './login.service';
import { retry } from 'rxjs/operators';

export interface notifyRespConfig {
  status: string;
  status_code: number;
  message: string;
}

export interface notifypostRespConfig {
  status_code: number;
  message: string;
  data: any;
}
export interface notifypageRespConfig {
  status_code: number;
  status: string;
  message: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  // Add or Send Notifications API //
  addNotifications(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<notifyRespConfig>(LoginService.API_Base_URL + '/sendnotificationstousers', request, { headers: headers }).pipe(retry(1));
  }

  // Get posts //
  getPosts(request) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<notifypostRespConfig>(LoginService.API_Base_URL + '/searchwithtags', request, { headers: headers }).pipe(retry(1));
  }

  // get pages //
  getPages() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<notifypageRespConfig>(LoginService.API_Base_URL + '/getpages?admin_request=2', { headers: headers }).pipe(retry(1));
  }
}
