import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from './login.service';
import { retry } from 'rxjs/operators';

export interface pagesRespConfig {
  status: string;
  status_code: number;
  message: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class PagesService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  // Update Owner Post Details API //
  updateOwnerPageDetails(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<pagesRespConfig>(LoginService.API_Base_URL + '/saveorupdatepage', request, { headers: headers }).pipe(retry(1));
  }

  // Delete Owner Page API //
  deleteOwnerPage(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<pagesRespConfig>(LoginService.API_Base_URL + '/deletepage', request, { headers: headers }).pipe(retry(1));
  }

  // Get All Pages API //
  getAllPages() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<pagesRespConfig>(LoginService.API_Base_URL + '/getpages?admin_request=1', { headers: headers }).pipe(retry(1));
  }

  // Get All Pages API //
  getAllRSSPages() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<pagesRespConfig>(LoginService.API_Base_URL + '/getfeedslistonload', { headers: headers }).pipe(retry(1));
  }

  // Update Page Details API //
  updatePageDetails(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<pagesRespConfig>(LoginService.API_Base_URL + '/saveorupdatepage', request, { headers: headers }).pipe(retry(1));
  }

  // Enable or Disable Page Comments API //
  enableOrDisableComments(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<pagesRespConfig>(LoginService.API_Base_URL + '/updatepagecommentstatus', request, { headers: headers }).pipe(retry(1));
  }

  // Enable or Disable Page Courtest API //
  enableOrDisableCourtesy(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<pagesRespConfig>(LoginService.API_Base_URL + '/updatecourtesystatus', request, { headers: headers }).pipe(retry(1));
  }

  // Make Page as Default Follow or Not API //
  makeAsDefaultPage(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<pagesRespConfig>(LoginService.API_Base_URL + '/updatedefaultfollowstatus', request, { headers: headers }).pipe(retry(1));
  }

  // Make as Celebrity Page or Not API //
  makeAsCelebrityPage(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<pagesRespConfig>(LoginService.API_Base_URL + '/updatecelebritystatus', request, { headers: headers }).pipe(retry(1));
  }
}
