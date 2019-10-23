import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { CategoriesComponent } from 'app/categories/categories.component';
import { MatButtonModule, MatInputModule, MatRippleModule, MatFormFieldModule, MatTooltipModule, MatSelectModule, MatTableModule, MatIconModule, MatPaginatorModule } from '@angular/material';
import { CategoryService } from 'app/services/category.service';
import { SubcategoriesComponent } from 'app/subcategories/subcategories.component';
import { RegisteredusersComponent } from 'app/registeredusers/registeredusers.component';
import { UsersService } from 'app/services/users.service';
import { Dashboard2Component } from 'app/dashboard2/dashboard2.component';
import { DashboardService } from 'app/services/dashboard.service';
import { UserpostsComponent } from 'app/userposts/userposts.component';
import { RsspostsComponent } from 'app/rssposts/rssposts.component';
import { PostsService } from 'app/services/posts.service';
import { BannersComponent } from 'app/banners/banners.component';
import { AddsComponent } from 'app/adds/adds.component';
import { BannersService } from 'app/services/banners.service';
import { AddsService } from 'app/services/adds.service';
import { PageownersComponent } from 'app/pageowners/pageowners.component';
import { AbusepostsComponent } from 'app/abuseposts/abuseposts.component';
import { PagesService } from 'app/services/pages.service';
import { TrendingcategoriesComponent } from 'app/trendingcategories/trendingcategories.component';
import { TrendingpostsComponent } from 'app/trendingposts/trendingposts.component';
import { MobileusersComponent } from 'app/mobileusers/mobileusers.component';
import { WebusersComponent } from 'app/webusers/webusers.component';
import { RolemanagementComponent } from 'app/rolemanagement/rolemanagement.component';
import { RolesService } from 'app/services/roles.service';
import { EnquiriesComponent } from 'app/enquiries/enquiries.component';
import { EnquiriesService } from 'app/services/enquiries.service';
import { PagesComponent } from 'app/pages/pages.component';
import { PollsComponent } from 'app/polls/polls.component';
import { UserpagesComponent } from 'app/userpages/userpages.component';
import { NotificationsService } from 'app/services/notifications.service';
import { PollsService } from 'app/services/polls.service';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import { HeroimagesComponent } from 'app/heroimages/heroimages.component';
import { HeroimagesService } from 'app/services/heroimages.service';
import { LivesComponent } from 'app/lives/lives.component';
import { CreatePostComponent } from 'app/create-post/create-post.component';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { IntlModule } from '@progress/kendo-angular-intl';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { LiveService } from 'app/services/live.service';
import { EmbedVideo } from 'ngx-embed-video';
import { AddsInPostsComponent } from 'app/adds-in-posts/adds-in-posts.component';
import { ConfigurationsComponent } from 'app/configurations/configurations.component';
import { ConfigurationsService } from 'app/services/configurations.service';
import { ScratchcardComponent } from 'app/scratchcard/scratchcard.component';
import { ScratchcardService } from 'app/services/scratchcard.service';
import { LeaderboardComponent } from 'app/leaderboard/leaderboard.component';
import { PackagesComponent } from 'app/packages/packages.component';
import { MembersComponent } from 'app/members/members.component';
import { PackagesService } from 'app/services/packages.service';
import { MembersService } from 'app/services/members.service';
import { ReferredScratchcardComponent } from '../../referred-scratchcard/referred-scratchcard.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    AngularDateTimePickerModule,
    TreeViewModule,
    IntlModule,
    DateInputsModule,
    EmbedVideo.forRoot()
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    CategoriesComponent,
    SubcategoriesComponent,
    RegisteredusersComponent,
    Dashboard2Component,
    UserpostsComponent,
    RsspostsComponent,
    BannersComponent,
    AddsComponent,
    PageownersComponent,
    AbusepostsComponent,
    TrendingcategoriesComponent,
    TrendingpostsComponent,
    MobileusersComponent,
    WebusersComponent,
    RolemanagementComponent,
    EnquiriesComponent,
    PagesComponent,
    PollsComponent,
    UserpagesComponent,
    HeroimagesComponent,
    LivesComponent,
    CreatePostComponent,
    AddsInPostsComponent,
    ConfigurationsComponent,
    ScratchcardComponent,
    LeaderboardComponent,
    PackagesComponent,
    MembersComponent,
    ReferredScratchcardComponent
  ],
  providers: [
    CategoryService,
    UsersService,
    DashboardService,
    PostsService,
    BannersService,
    AddsService,
    PagesService,
    RolesService,
    EnquiriesService,
    NotificationsService,
    PollsService,
    HeroimagesService,
    LiveService,
    ConfigurationsService,
    ScratchcardService,
    PackagesService,
    MembersService
  ]
})

export class AdminLayoutModule { }
