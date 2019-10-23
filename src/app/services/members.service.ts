import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { LoginService } from './login.service';
import { CookieService } from 'ngx-cookie-service';

export interface membersConfig {
  status: string;
  status_code: number;
  data: any;
  message: string;
}

export interface memberCreateConfig {
  status: string;
  status_code: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }


  // Get Packages API //
  getpackages() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<membersConfig>(LoginService.API_Base_URL + '/getactivepackage', { headers: headers }).pipe(retry(1));
  }

  // Get Members API //
  getmembers() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<membersConfig>(LoginService.API_Base_URL + '/getallmembers', { headers: headers }).pipe(retry(1));
  }

  // Add Member //
  createMember(request) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<memberCreateConfig>(LoginService.API_Base_URL + '/saveorupdatemembershipsubscription', request, { headers: headers }).pipe(retry(1));
  }

  // Update member //
  updatemember(request) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<memberCreateConfig>(LoginService.API_Base_URL + '/saveorupdatemembershipsubscription', request, { headers: headers }).pipe(retry(1));
  }
}
