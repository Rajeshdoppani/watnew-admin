import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { LoginService } from './login.service';
import { CookieService } from 'ngx-cookie-service';

export interface addFeedRespConfig {
  status: string;
  status_code: number;
  message: string;
}

export interface feedsRespConfig {
  status: string;
  status_code: number;
  message: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  // Get Users & Cards Count API//
  getUsersAndCardsCount() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<feedsRespConfig>(LoginService.API_Base_URL + '/getcounts', { headers: headers }).pipe(retry(1));
  }

  // Create or Update RSS Feeds API //
  addFeeds(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<addFeedRespConfig>(LoginService.API_Base_URL + '/saveorupdaterss', request, { headers: headers }).pipe(retry(1));
  }

  // Get All Feeds List API //
  getAllFeeds() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<feedsRespConfig>(LoginService.API_Base_URL + '/getfeedslist', { headers: headers }).pipe(retry(1));
  }

  // Get All Feeds Schedulers API //
  getFeedsSchedulers() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<feedsRespConfig>(LoginService.API_Base_URL + '/getschedulartimes', { headers: headers }).pipe(retry(1));
  }

  // Delete Feed Scheduler API //
  deleteFeedScheduler(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<addFeedRespConfig>(LoginService.API_Base_URL + '/deletefeedschedular', request, { headers: headers }).pipe(retry(1));
  }

  // Get Feeds By Category API //
  getFeedsByCategories(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<feedsRespConfig>(LoginService.API_Base_URL + '/getfeedslistbycategory', request, { headers: headers }).pipe(retry(1));
  }
}
