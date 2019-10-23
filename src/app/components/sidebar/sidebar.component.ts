import { Component, OnInit } from '@angular/core';
import { LoginService } from 'app/services/login.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  list: any[];
}
export const ROUTES: RouteInfo[] = [
  {
    path: '', title: 'Dashboard', icon: 'dashboard', class: '', list: [
      { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
      { path: '/rss_console', title: 'RSS Console', icon: 'rss_feed', class: '' }
    ]
  },
  {
    path: '', title: 'Categories', icon: 'view_list', class: '', list: [
      { path: '/main_categories', title: 'Main Categories', icon: 'view_list', class: '' },
      { path: '/sub_categories', title: 'Sub Categories', icon: 'list', class: '' },
      { path: '/trending_categories', title: 'Trending Categories', icon: 'view_column', class: '' }
    ]
  },
  {
    path: '', title: 'Users', icon: 'group', class: '', list: [
      { path: '/registered_users', title: 'Registered Users', icon: 'people_outline', class: '', list: [] },
      { path: '/mobile_users', title: 'Mobile Users', icon: 'phone_android', class: '', list: [] },
      { path: '/web_users', title: 'Web Users', icon: 'desktop_windows', class: '', list: [] },
      { path: '/pageowners', title: 'Page Owners', icon: 'pages', class: '', list: [] },
    ]
  },
  {
    path: '', title: 'Advertisements', icon: 'card_membership', class: '', list: [
      { path: '/adds', title: 'Adds', icon: 'branding_watermark', class: '' },
      { path: '/banners', title: 'Banners', icon: 'receipt', class: '' },
      { path: '/adds_in_posts_or_live', title: 'Adds In Posts/Live', icon: 'note_add', class: '' },
      { path: '/hero_images', title: 'Hero Images', icon: 'add_a_photo', class: '' }      
    ]
  },
  {
    path: '', title: 'Pages', icon: 'content_paste', class: '', list: [
      { path: '/rss_pages', title: 'RSS Pages', icon: 'content_paste', class: '' },
      { path: '/user_pages', title: 'User Pages', icon: 'mms', class: '' }
    ]
  },
  {
    path: '', title: 'Posts', icon: 'local_post_office', class: '', list: [
      { path: '/rss_posts', title: 'RSS Posts', icon: 'contact_mail', class: '' },
      { path: '/user_posts', title: 'User Posts', icon: 'mail_outline', class: '' },
      { path: '/trending_posts', title: 'Trending Posts', icon: 'bookmark', class: '' },
      { path: '/abuse_posts', title: 'Abuse Posts', icon: 'report', class: '' }      
    ]
  },
  {
    path: '', title: 'Scratch Cards', icon: 'memory', class: '', list: [
      { path: '/user_scratchcard', title: 'Merchant Scrtch Cards', icon: 'memory', class: '' },
      { path: '/referred_scratchcard', title: 'Referred Scratch Cards', icon: 'memory', class: '' },
      { path: '/scratch_card_leaderboard', title: 'Leader Baord', icon: 'sort', class: '' },
    ]
  },
  {
    path: '', title: 'Packages & Members', icon: 'view_list', class: '', list: [
      { path: '/packages', title: 'Packages', icon: 'list', class: '' },
      { path: '/members', title: 'Members', icon: 'list', class: '' },
    ]
  },
  { path: '/polls', title: 'Polls', icon: 'poll', class: '', list: [] },
  { path: '/lives', title: 'Live', icon: 'live_tv', class: '', list: [] },
  { path: '/configurations', title: 'Configurations', icon: 'settings_applications', class: '', list: [] },
  { path: '/role_management', title: 'Role Management', icon: 'assignment_ind', class: '', list: [] },
  { path: '/notifications', title: 'Notifications', icon: 'notifications', class: '', list: [] },
  { path: '/enquiries', title: 'Enquiries', icon: 'feedback', class: '', list: [] }
  /*
  { path: '/user-profile', title: 'User Profile', icon: 'person', class: '', list: [] },
  { path: '/table-list', title: 'Table List', icon: 'content_paste', class: '', list: [] },
  { path: '/typography', title: 'Typography', icon: 'library_books', class: '', list: [] },
  { path: '/icons', title: 'Icons', icon: 'bubble_chart', class: '', list: [] },
  { path: '/maps', title: 'Maps', icon: 'location_on', class: '', list: [] },
  */
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor(private loginService: LoginService, private cookieService: CookieService, private router: Router) { }

  // Logout Function //
  logoutUser() {
    this.loginService.logoutUser().subscribe(data => {
      if (data.status == 'success' && data.status_code == 200) {
        this.cookieService.deleteAll();
        this.router.navigate(['login']);
      }
      else {

      }
    });
  }

  onToggle(index: any): void {
    $(this).toggleClass("on");
    $("#subMenuView" + index).slideToggle();
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };
}
