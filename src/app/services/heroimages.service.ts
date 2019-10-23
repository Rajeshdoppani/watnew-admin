import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from './login.service';
import { CookieService } from 'ngx-cookie-service';
import { retry } from 'rxjs/operators';

export interface heroImagesResp {
  status: string;
  status_code: number;
  message: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})

export class HeroimagesService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  // Create or Update Hero Image API // 
  createHeroImage(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<heroImagesResp>(LoginService.API_Base_URL + '/saveorupdateheroimage', request, { headers: headers }).pipe(retry(1));
  }

  // Get Hero Image Details API //
  getHeroImageDetails() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<heroImagesResp>(LoginService.API_Base_URL + '/getheroimage', { headers: headers }).pipe(retry(1));
  }

  // Delete Hero Image API //
  deletHeroImage(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<heroImagesResp>(LoginService.API_Base_URL + '/deleteheroimage', request, { headers: headers }).pipe(retry(1));
  }
}
