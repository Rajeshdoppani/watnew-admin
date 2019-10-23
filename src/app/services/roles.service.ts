import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from './login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry } from 'rxjs/operators';

declare interface rolesResp {
  status: string;
  status_code: number;
  message: string;
  data: any[]
}

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private cookieService: CookieService, private http: HttpClient) { }

  // Get All Roles API //
  getAllRoles() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<rolesResp>(LoginService.API_Base_URL + '/getroles', { headers: headers }).pipe(retry(1));
  }

  // Get All Permissions API //
  getAllpermissions() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<rolesResp>(LoginService.API_Base_URL + '/getpermissions', { headers: headers }).pipe(retry(1));
  }

  // Assign Permissions API //
  assignPermissions(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<rolesResp>(LoginService.API_Base_URL + '/attachpermission', request, { headers: headers }).pipe(retry(1));
  }
}
