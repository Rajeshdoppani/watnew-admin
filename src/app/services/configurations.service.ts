import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from './login.service';
import { retry } from 'rxjs/operators';

declare interface configResp {
  status: string;
  status_code: number;
  message: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigurationsService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

   // Get System Configurations API //
   getAllSystemConfigurations() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<configResp>(LoginService.API_Base_URL + '/getsystemcofigurations', { headers: headers }).pipe(retry(1));
  }

  // Update System Configurations API //
  updateSystemConfigurations(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<configResp>(LoginService.API_Base_URL + '/updatesystemconfigurations', request, { headers: headers }).pipe(retry(1));
  }

}
