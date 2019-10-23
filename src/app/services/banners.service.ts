import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from './login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry } from 'rxjs/operators';

export interface bannersRespConfig {
  status: string;
  status_code: number;
  data: any[];
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class BannersService {

  constructor(private cookieService: CookieService, private http: HttpClient) { }

  // Get All Banners API //
  getAllBanners() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<bannersRespConfig>(LoginService.API_Base_URL + '/getbannersadmin?admin_request=1', { headers: headers }).pipe(retry(1));
  }

  // Create or Update Banners API //
  createBanners(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<bannersRespConfig>(LoginService.API_Base_URL + '/saveorupdatebanners', request, { headers: headers }).pipe(retry(1));
  }

  // Delete Banners API //
  deleteBanner(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<bannersRespConfig>(LoginService.API_Base_URL + '/deletebanners', request, { headers: headers }).pipe(retry(1));
  }
}
