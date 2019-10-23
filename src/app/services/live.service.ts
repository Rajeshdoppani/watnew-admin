import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from './login.service';
import { CookieService } from 'ngx-cookie-service';
import { retry } from 'rxjs/operators';

declare interface statesRespConfig {
  status: string;
  status_code: number;
  message: string;
  data: any;
}
@Injectable({
  providedIn: 'root'
})
export class LiveService {

  constructor(private cookieService: CookieService, private http: HttpClient) { }

  // Get All States API //
  getAllStates() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<statesRespConfig>(LoginService.API_Base_URL + '/getstates', { headers: headers }).pipe(retry(1));
  }


  // Get All Lives Data API //
  getAllData() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<statesRespConfig>(LoginService.API_Base_URL + '/getlivesadminonload', { headers: headers }).pipe(retry(1));
  }

  // Get All Lives API //
  getAllLives(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<statesRespConfig>(LoginService.API_Base_URL + '/getlivesadmin?admin_request=1', request, { headers: headers }).pipe(retry(1));
  }

  // Save or Update Live API //
  saveOrUpdateLive(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<statesRespConfig>(LoginService.API_Base_URL + '/saveorupdatelive', request, { headers: headers }).pipe(retry(1));
  }

  // Get Live Details By Id API //
  getLiveDetailsById(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<statesRespConfig>(LoginService.API_Base_URL + '/getlivebyid', request, { headers: headers }).pipe(retry(1));
  }

  // Delete Live Event API //
  deleteLiveEvent(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<statesRespConfig>(LoginService.API_Base_URL + '/deletelive', request, { headers: headers }).pipe(retry(1));
  }
}
