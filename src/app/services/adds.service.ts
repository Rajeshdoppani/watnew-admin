import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from './login.service';
import { CookieService } from 'ngx-cookie-service';
import { retry } from 'rxjs/operators';

export interface addsRespConfig {
  status: string;
  status_code: number;
  data: any[];
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AddsService {

  constructor(private cookieService: CookieService, private http: HttpClient) { }

  // Get All Adds API //
  getAllAdds() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<addsRespConfig>(LoginService.API_Base_URL + '/getadds', { headers: headers }).pipe(retry(1));
  }

  // Create or Update Adds API //
  createAdds(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<addsRespConfig>(LoginService.API_Base_URL + '/saveorupdateadds', request, { headers: headers }).pipe(retry(1));
  }

  // Delete Add API //
  deleteAdd(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<addsRespConfig>(LoginService.API_Base_URL + '/deleteadds', request, { headers: headers }).pipe(retry(1));
  }

  // Delete Add Image Or Video API //
  deleteAddImageorVideo(request: any, type: string) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    if (type === "image") {
      return this.http.post<addsRespConfig>(LoginService.API_Base_URL + '/deleteaddsimage', request, { headers: headers }).pipe(retry(1));
    }
    else {
      return this.http.post<addsRespConfig>(LoginService.API_Base_URL + '/deleteaddsvideo', request, { headers: headers }).pipe(retry(1));
    }
    
  }
}
