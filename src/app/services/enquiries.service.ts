import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from './login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry } from 'rxjs/operators';

export interface enquiriesRespConfig {
  status: string;
  status_code: number;
  message: string;
  data: any[]
}

@Injectable({
  providedIn: 'root'
})
export class EnquiriesService {

  constructor(private cookieService: CookieService, private http: HttpClient) { }

  // Get All Enquiries List API //
  getAllEnquiries() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<enquiriesRespConfig>(LoginService.API_Base_URL + '/getallenquires', { headers: headers }).pipe(retry(1));
  }
}
