import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'app/services/login.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private loginService: LoginService, private cookieService: CookieService) {

    // Clearing the Cookie Data //
    this.cookieService.deleteAll();

    // Login Form Inputs or Controls //
    this.loginForm = this.formBuilder.group({
      'email': ['', [Validators.required]],
      'password': ['', [Validators.required]]
    });
  }

  // Login Function // 
  loginAuthentication() {
    var request = {
      email: this.loginForm.controls['email'].value,
      password: this.loginForm.controls['password'].value
    };
    this.loginService.loginAuthentication(request).subscribe(resp => {
      this.cookieService.deleteAll();
      if(resp.status == "success" && resp.status_code == "200") {
        this.cookieService.set('barrierToken', JSON.stringify(resp.data.token));
        this.cookieService.set('authId', JSON.stringify(resp.data.id));
        this.cookieService.set('authNickName', JSON.stringify(resp.data.nick_name));
        this.cookieService.set('authMobile', JSON.stringify(resp.data.mobile));
        this.cookieService.set('authEmail', JSON.stringify(resp.data.email));
        this.cookieService.set('isAuthenticated', 'true');
        this.router.navigate(['dashboard']);
      }
      else {
        this.cookieService.deleteAll();
        alert(resp.message);
      }
    });
    
  };

  ngOnInit() {
  }

}
