import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { retry } from 'rxjs/operators';

export interface pollRespConfig {
  status: string;
  status_code: number;
  message: string;
  data: any[];
}

export interface pollListRespConfig {
  status: string;
  status_code: number;
  message: string;
  data: any;
}

export interface pollsrecordsConfig {
  status: string;
  status_code: number;
  message: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class PollsService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  // Create or Update Poll API //
  createOrUpdatePoll(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<pollRespConfig>(LoginService.API_Base_URL + '/saveorupdatepoll', request, { headers }).pipe(retry(1));
  }

  // Get All Polls API //
  getPolls(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<pollListRespConfig>(LoginService.API_Base_URL + '/getpolls', request, { headers }).pipe(retry(1));
  }

  // Get All Polls API //
  getPollsRecords() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<pollsrecordsConfig>(LoginService.API_Base_URL + '/getpollsonload', { headers }).pipe(retry(1));
  }

  // Delete Poll API //
  deletePoll(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<pollListRespConfig>(LoginService.API_Base_URL + '/deletepoll', request, { headers }).pipe(retry(1));
  }

}
