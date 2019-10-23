import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry } from 'rxjs/operators';

export interface postsRespConfig {
  status: string;
  status_code: number;
  message: string;
  data: any[];
}
export interface postsDataConfig {
  status: string;
  status_code: number;
  message: string;
  data: any;
}

export interface trendPostsResp {
  status: string;
  status_code: number;
  posts: any[];
}
@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  // Create Post API //
  createPost(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<postsDataConfig>(LoginService.API_Base_URL + '/saveorupdatepost', request, { headers: headers }).pipe(retry(1));
  }

  // Get All Posts API //
  getAllPosts(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<postsDataConfig>(LoginService.API_Base_URL + '/getposts?admin_request=1', request, { headers: headers }).pipe(retry(1));
  }

  // Update Post API //
  updatePostDetails(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<postsRespConfig>(LoginService.API_Base_URL + '/saveorupdatepost', request, { headers: headers }).pipe(retry(1));
  }

  // Delete Post API //
  deletePost(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<postsRespConfig>(LoginService.API_Base_URL + '/deletepost', request, { headers: headers }).pipe(retry(1));
  }

  // Get All Abused Posts API //
  getAllAbusePosts() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<postsRespConfig>(LoginService.API_Base_URL + '/getabusereport', { headers: headers }).pipe(retry(1));
  }

  // Update Abused Post Details API //
  updateAbusedPost(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<postsRespConfig>(LoginService.API_Base_URL + '/saveorupdateabusereport', request, { headers: headers }).pipe(retry(1));
  }

  // Get All Abuse Post Reasons API //
  getAllAbusePostReasons() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<postsRespConfig>(LoginService.API_Base_URL + '/getabusereasons', { headers: headers }).pipe(retry(1));
  }

  // Get All Trending Posts API //
  getAllTrendingPosts() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<trendPostsResp>(LoginService.API_Base_URL + '/trendingposts?admin_request=1', { headers: headers }).pipe(retry(1));
  }

  // Get All user Posts API //
  getAllPostsRecords() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<postsDataConfig>(LoginService.API_Base_URL + '/getuserpostsonload', { headers: headers }).pipe(retry(1));
  }

  getRSSPostsRecords() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.get<postsDataConfig>(LoginService.API_Base_URL + '/getrsspostsonload', { headers: headers }).pipe(retry(1));
  }

  // Delete Post Image Or Video API //
  deletePostImageOrVideo(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<postsRespConfig>(LoginService.API_Base_URL + '/deletepostimagevideo', request, { headers: headers }).pipe(retry(1));
  }

  // Enable Or Disable Post Comments API //
  enableOrDisableComments(request: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(this.cookieService.get('barrierToken'))
    });
    return this.http.post<postsRespConfig>(LoginService.API_Base_URL + '/updatepostcommentstatus', request, { headers: headers }).pipe(retry(1));
  }
}
