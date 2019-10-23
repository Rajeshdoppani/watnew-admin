import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './login/login.component';
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule, MatTooltipModule, MatTableModule, MatIconModule, MatPaginatorModule } from '@angular/material';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { IntlModule } from '@progress/kendo-angular-intl';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER, POSITION, PB_DIRECTION, NgxUiLoaderHttpModule, NgxUiLoaderRouterModule } from 'ngx-ui-loader';

// Services //
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from './services/login.service';
import { EmbedVideo } from 'ngx-embed-video';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsColor: '#343a40c4',
  bgsColor: '#FFFFFF',
  bgsPosition: POSITION.bottomCenter,
  bgsSize: 40,
  bgsType: SPINNER.rectangleBounce,
  fgsType: SPINNER.squareJellyBox,
  pbDirection: PB_DIRECTION.leftToRight,
  pbThickness: 5,
  hasProgressBar: false,
  text: 'Loading...',
  textColor: '#a9afbb',
};

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    AngularDateTimePickerModule,
    TreeViewModule,
    IntlModule,
    DateInputsModule,
    EmbedVideo.forRoot(),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
    NgxUiLoaderRouterModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent
  ],
  providers: [CookieService, LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
