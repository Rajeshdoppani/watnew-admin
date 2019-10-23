import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from 'app/services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
declare var jQuery: any;

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    private listTitles: any[];
    errorMessage: string;
    passMatcherror: string;
    successMessage: string;
    location: Location;
    mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;
    notificationList: any;
    nextpageURL: any;
    resetpasswordForm: FormGroup;
    unread_notification_count: any;
    posDate: any;
    datefuture: any;
    currentdate: any;
    scrollValue: any;
    constructor(private formBuilder: FormBuilder, location: Location, private element: ElementRef, private router: Router, private loginService: LoginService, private cookieService: CookieService) {
        // Configurations Details Form Controls //
        this.resetpasswordForm = this.formBuilder.group({
            password: ['', Validators.required],
            password_confirmation: ['', Validators.required]
        });

        this.location = location;
        this.sidebarVisible = false;
        this.getAdminNotifications();
    }

    // Logout Function //
    logoutUser() {
        this.loginService.logoutUser().subscribe(data => {
            if (data.status == 'success' && data.status_code == 200) {
                this.cookieService.deleteAll();
                this.router.navigate(['login']);
            }
        });
    }

    getAdminNotifications() {
        this.loginService.getNotifications().subscribe(data => {
            if (data.status_code == 200) {
                this.notificationList = data.data.data;
                this.nextpageURL = data.data.next_page_url;
                if (data.notification_unread_count == 0) {
                    this.unread_notification_count = '0';
                } else {
                    this.unread_notification_count = data.notification_unread_count;
                }
                for (let l = 0; l < this.notificationList.length; l++) {
                    this.posDate = this.notificationList[l].created_at + '.000Z';
                    this.datefuture = new Date(this.posDate.replace(' ', 'T'));
                    this.currentdate = new Date();
                    var diffInSeconds = Math.abs(this.datefuture - this.currentdate) / 1000;
                    var days = Math.floor(diffInSeconds / 60 / 60 / 24);
                    var hours = Math.floor(diffInSeconds / 60 / 60 % 24);
                    var minutes = Math.floor(diffInSeconds / 60 % 60);
                    var seconds = Math.floor(diffInSeconds % 60);
                    var milliseconds = Math.round((diffInSeconds - Math.floor(diffInSeconds)) * 1000);
                    if (days != 0) {
                        if (days > 1) {
                            this.notificationList[l].created_at = days + ' days ago';
                        } else {
                            this.notificationList[l].created_at = days + ' day ago';
                        }
                    } else if (hours != 0 && days == 0) {
                        if (hours > 1) {
                            if (minutes > 50) {
                                var Hours = hours + 1;
                                this.notificationList[l].created_at = Hours + ' hours ago';
                            } else {
                                this.notificationList[l].created_at = hours + ' hours ago';
                            }
                        } else {
                            this.notificationList[l].created_at = hours + ' hour ago';
                        }
                    } else if (minutes != 0 && hours == 0) {
                        if (minutes > 1) {
                            if (seconds > 50) {
                                var Minutes = minutes + 1;
                                this.notificationList[l].created_at = Minutes + ' minutes ago';
                            } else {
                                this.notificationList[l].created_at = minutes + ' minutes ago';
                            }
                        } else {
                            this.notificationList[l].created_at = minutes + ' minute ago';
                        }
                    } else if (seconds != 0 && minutes == 0 && hours == 0) {
                        if (seconds > 1) {
                            if (milliseconds > 50) {
                                var Seconds = seconds + 1;
                                this.notificationList[l].created_at = Seconds + ' seconds ago';
                            } else {
                                this.notificationList[l].created_at = seconds + ' seconds ago';
                            }
                        } else {
                            this.notificationList[l].created_at = seconds + ' second ago';
                        }
                    }
                }
                if (this.nextpageURL != null) {
                    this.cookieService.set('scrollVal', '0');
                    this.cookieService.set('notificationURL', this.nextpageURL);
                } else {
                    this.cookieService.set('notificationURL', null);
                }
            }
        });

    }

    resetPassworrd() {
        this.resetpasswordForm.reset();
        this.passMatcherror = "";
        jQuery('#resetpasswordModal').modal('show');
    }


    // Update Admin Password //
    updatePassword(): void {
        if (this.resetpasswordForm.controls['password'].value != this.resetpasswordForm.controls['password_confirmation'].value) {
            this.passMatcherror = "Password doesn't match";
        } else {
            let formData = new FormData();
            formData.append('password', this.resetpasswordForm.controls['password'].value);
            formData.append('password_confirmation', this.resetpasswordForm.controls['password_confirmation'].value);
            this.loginService.reset_password(formData).subscribe(resp => {
                this.getUpdatedStatus(resp);
            });
        }
    }

    // Get Status After Updating Configuration Function //
    getUpdatedStatus(resp: any): void {
        jQuery('#resetpasswordModal').modal('hide');
        if (resp.status == 'success' && resp.status_code == 200) {
            this.successMessage = resp.message;
            jQuery('#successMessageModal').modal('show');
        } else {
            this.errorMessage = resp.message;
            jQuery('#errorMessageModal').modal('show');
        }
    }



    @HostListener('scroll', ['$event'])
    scrollHandler(event: any) {
        if ((event.target.offsetHeight + event.target.scrollTop + 10) >= event.target.scrollHeight) {
            // you're at the bottom of the page
            console.log('freds');
            this.scrollValue = this.cookieService.get('scrollVal');
            if (this.scrollValue == '0') {
                this.LoadContent();
            }
        }
    }

    LoadContent() {
        var notifynextURL = this.cookieService.get('notificationURL');
        if (notifynextURL != null) {
            this.loginService.getmorenotifications(notifynextURL).subscribe(data => {
                if (data.status_code == 200) {
                    let nextnotification = data.data.data;
                    this.nextpageURL = data.data.next_page_url;
                    if (this.nextpageURL != null) {
                        this.cookieService.set('notificationURL', this.nextpageURL);
                    } else {
                        this.cookieService.set('notificationURL', null);
                    }
                    if (data.notification_unread_count == 0) {
                        this.unread_notification_count = '0';
                    } else {
                        this.unread_notification_count = data.notification_unread_count;
                    }
                    for (let l = 0; l < nextnotification.length; l++) {
                        this.posDate = nextnotification[l].created_at + '.000Z';
                        this.datefuture = new Date(this.posDate.replace(' ', 'T'));
                        this.currentdate = new Date();
                        var diffInSeconds = Math.abs(this.datefuture - this.currentdate) / 1000;
                        var days = Math.floor(diffInSeconds / 60 / 60 / 24);
                        var hours = Math.floor(diffInSeconds / 60 / 60 % 24);
                        var minutes = Math.floor(diffInSeconds / 60 % 60);
                        var seconds = Math.floor(diffInSeconds % 60);
                        var milliseconds = Math.round((diffInSeconds - Math.floor(diffInSeconds)) * 1000);
                        if (days != 0) {
                            if (days > 1) {
                                nextnotification[l].created_at = days + ' days ago';
                            } else {
                                nextnotification[l].created_at = days + ' day ago';
                            }
                        } else if (hours != 0 && days == 0) {
                            if (hours > 1) {
                                if (minutes > 50) {
                                    var Hours = hours + 1;
                                    nextnotification[l].created_at = Hours + ' hours ago';
                                } else {
                                    nextnotification[l].created_at = hours + ' hours ago';
                                }
                            } else {
                                nextnotification[l].created_at = hours + ' hour ago';
                            }
                        } else if (minutes != 0 && hours == 0) {
                            if (minutes > 1) {
                                if (seconds > 50) {
                                    var Minutes = minutes + 1;
                                    nextnotification[l].created_at = Minutes + ' minutes ago';
                                } else {
                                    nextnotification[l].created_at = minutes + ' minutes ago';
                                }
                            } else {
                                nextnotification[l].created_at = minutes + ' minute ago';
                            }
                        } else if (seconds != 0 && minutes == 0 && hours == 0) {
                            if (seconds > 1) {
                                if (milliseconds > 50) {
                                    var Seconds = seconds + 1;
                                    nextnotification[l].created_at = Seconds + ' seconds ago';
                                } else {
                                    nextnotification[l].created_at = seconds + ' seconds ago';
                                }
                            } else {
                                nextnotification[l].created_at = seconds + ' second ago';
                            }
                        }
                    }
                    this.notificationList = this.notificationList.concat(nextnotification);
                }
            });
        }
    }

    markRead() {
        $('.notifySection').toggleClass('show');
        this.loginService.markallread().subscribe(data => {
            if (data.status_code == 200) {
                let notoficationdata = data.data.data;
                for (let l = 0; l < this.notificationList.length; l++) {
                    this.posDate = notoficationdata[l].created_at + '.000Z';
                    this.datefuture = new Date(this.posDate.replace(' ', 'T'));
                    this.currentdate = new Date();
                    var diffInSeconds = Math.abs(this.datefuture - this.currentdate) / 1000;
                    var days = Math.floor(diffInSeconds / 60 / 60 / 24);
                    var hours = Math.floor(diffInSeconds / 60 / 60 % 24);
                    var minutes = Math.floor(diffInSeconds / 60 % 60);
                    var seconds = Math.floor(diffInSeconds % 60);
                    var milliseconds = Math.round((diffInSeconds - Math.floor(diffInSeconds)) * 1000);
                    if (days != 0) {
                        if (days > 1) {
                            notoficationdata[l].created_at = days + ' days ago';
                        } else {
                            notoficationdata[l].created_at = days + ' day ago';
                        }
                    } else if (hours != 0 && days == 0) {
                        if (hours > 1) {
                            if (minutes > 50) {
                                var Hours = hours + 1;
                                notoficationdata[l].created_at = Hours + ' hours ago';
                            } else {
                                notoficationdata[l].created_at = hours + ' hours ago';
                            }
                        } else {
                            notoficationdata[l].created_at = hours + ' hour ago';
                        }
                    } else if (minutes != 0 && hours == 0) {
                        if (minutes > 1) {
                            if (seconds > 50) {
                                var Minutes = minutes + 1;
                                notoficationdata[l].created_at = Minutes + ' minutes ago';
                            } else {
                                notoficationdata[l].created_at = minutes + ' minutes ago';
                            }
                        } else {
                            notoficationdata[l].created_at = minutes + ' minute ago';
                        }
                    } else if (seconds != 0 && minutes == 0 && hours == 0) {
                        if (seconds > 1) {
                            if (milliseconds > 50) {
                                var Seconds = seconds + 1;
                                notoficationdata[l].created_at = Seconds + ' seconds ago';
                            } else {
                                notoficationdata[l].created_at = seconds + ' seconds ago';
                            }
                        } else {
                            notoficationdata[l].created_at = seconds + ' second ago';
                        }
                    }
                }
                this.notificationList = notoficationdata;
                $('.notifySection').removeClass('show');
                if (data.notification_unread_count == 0) {
                    this.unread_notification_count = '0';
                } else {
                    this.unread_notification_count = data.notification_unread_count;
                }
            }
        });
    }

    ngOnInit() {
        this.listTitles = ROUTES.filter(listTitle => listTitle);
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        this.router.events.subscribe((event) => {
            this.sidebarClose();
            var $layer: any = document.getElementsByClassName('close-layer')[0];
            if ($layer) {
                $layer.remove();
                this.mobile_menu_visible = 0;
            }
        });
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);

        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const body = document.getElementsByTagName('body')[0];

        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
            body.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function () {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function () {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            } else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function () {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function () { //asign a function
                body.classList.remove('nav-open');
                this.mobile_menu_visible = 0;
                $layer.classList.remove('visible');
                setTimeout(function () {
                    $layer.remove();
                    $toggle.classList.remove('toggled');
                }, 400);
            }.bind(this);

            body.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };

    /*
    getTitle() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(2);
        }
        titlee = titlee.split('/').pop();

        for (var item = 0; item < this.listTitles.length; item++) {
            if (this.listTitles[item].path === titlee) {
                return this.listTitles[item].title;
            }
        }
        return 'Dashboard';
    }
    */

    getTitle() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(1);
        }
        titlee = titlee.split('/').pop();
        titlee = '/' + titlee;
        for (var item = 0; item < this.listTitles.length; item++) {
            if (this.listTitles[item].list.length !== 0) {
                for (var i = 0; i < this.listTitles[item].list.length; i++) {
                    if (this.listTitles[item].list[i].path === titlee) {
                        return this.listTitles[item].list[i].title;
                    }
                }
            }
            else {
                if (this.listTitles[item].path === titlee) {
                    return this.listTitles[item].title;
                }
            }
        }
        return 'Dashboard';
    }
}
