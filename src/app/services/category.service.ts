import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { LoginService } from './login.service';
import { CookieService } from 'ngx-cookie-service';

export interface createCatResp {
  status: string;
  message: string;
  status_code: number;
}

export interface getAllCatRespConfig {
  status: string;
  status_code: number;
  message: string;
  data: any[];
}

export interface getTrendCatResp {
  status: string;
  status_code: number;
  trending_categories: any[];
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  // Save or Update Category API //
  createCategory(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<createCatResp>(LoginService.API_Base_URL + '/saveorupdatecategories', request, { headers: headers }).pipe(retry(1));
  }

  // Get All Categories API //
  getAllCategories() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<getAllCatRespConfig>(LoginService.API_Base_URL + '/getcategories?admin_request=1', { headers: headers }).pipe(retry(1));
  }

  // Create Sub Category API //
  createSubCategory(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<createCatResp>(LoginService.API_Base_URL + '/saveorupdatesubcategories', request, { headers: headers }).pipe(retry(1));
  }

  // Get All Sub Categories //
  getAllSubCategories() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<getAllCatRespConfig>(LoginService.API_Base_URL + '/getsubcategories', { headers: headers }).pipe(retry(1));
  }

  // Delete Category API //
  deleteCategory(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<getAllCatRespConfig>(LoginService.API_Base_URL + '/deletecategory', request, { headers: headers }).pipe(retry(1));
  }

  // Delete Sub Category API //
  deleteSubCategory(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<getAllCatRespConfig>(LoginService.API_Base_URL + '/deletesubcategory', request, { headers: headers }).pipe(retry(1));
  }

  // Get Trendending Categories API //
  getTrendingCategories() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<getTrendCatResp>(LoginService.API_Base_URL + '/trendingcategories', { headers: headers}).pipe(retry(1));
  }

  // Enable or Disable Category Comments API //
  enableOrDisableComments(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<getAllCatRespConfig>(LoginService.API_Base_URL + '/updatecategorycommentstatus', request, { headers: headers }).pipe(retry(1));
  }

  // Trending Category Enable or Disable API //
  enableOrDisableTrendingCategory(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<getAllCatRespConfig>(LoginService.API_Base_URL + '/updatetrendingcategorystatus', request, { headers: headers }).pipe(retry(1));
  }

}
