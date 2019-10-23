import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { LoginService } from './login.service';
import { CookieService } from 'ngx-cookie-service';

export interface packagesConfig {
  status: string;
  status_code: number;
  data: any;
  message: string;
}

export interface packagecreateConfig {
  status: string;
  status_code: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class PackagesService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  // Get Packages API //
  getpackages() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<packagesConfig>(LoginService.API_Base_URL + '/getallpackage', { headers: headers }).pipe(retry(1));
  }

  // Add Package //
  createPackage(request) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<packagecreateConfig>(LoginService.API_Base_URL + '/saveorupdatepackage', request, { headers: headers }).pipe(retry(1));
  }

  // Update Package //
  updatePackage(request) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<packagecreateConfig>(LoginService.API_Base_URL + '/saveorupdatepackage', request, { headers: headers }).pipe(retry(1));
  }

    // Delete Package //
    deletePackage(request) {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
      });
      return this.http.post<packagecreateConfig>(LoginService.API_Base_URL + '/deletesubscription', request, { headers: headers }).pipe(retry(1));
    }

}
