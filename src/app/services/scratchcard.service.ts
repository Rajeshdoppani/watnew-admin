import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from './login.service';
import { CookieService } from 'ngx-cookie-service';
import { retry } from 'rxjs/operators';

declare interface scratchRespConfig {
  status: string;
  status_code: number;
  data: any[];
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ScratchcardService {

  constructor(private cookieService: CookieService, private http: HttpClient) { }

  // Get All User Scractch Cards API //
  getAllUsersScratechCards() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<scratchRespConfig>(LoginService.API_Base_URL + '/getallscarchcards', { headers: headers }).pipe(retry(1));
  }


  // Get All Reffered Scratch Cards API //
  getAllreferredScratechCards() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<scratchRespConfig>(LoginService.API_Base_URL + '/getallreferscarchcards', { headers: headers }).pipe(retry(1));
  }

  // Get All User Scractch Cards By Search API //
  getAllUsersScratechCardsBySearch(request) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<scratchRespConfig>(LoginService.API_Base_URL + '/getsearchscarchcards', request, { headers: headers }).pipe(retry(1));
  }

  // GET All Reffered Scratch Cards //
  getAllrefferedScratechCardsBySearch(request){
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<scratchRespConfig>(LoginService.API_Base_URL + '/getrefersearchscarchcards', request, { headers: headers }).pipe(retry(1));
  }

  // Get Leader Board of Users API //
  getLeaderBoardOfUsers() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<scratchRespConfig>(LoginService.API_Base_URL + '/getleaderboard', { headers }).pipe(retry(1));
  }

}
