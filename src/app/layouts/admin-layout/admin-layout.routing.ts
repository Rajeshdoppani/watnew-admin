import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { CategoriesComponent } from 'app/categories/categories.component';
import { SubcategoriesComponent } from 'app/subcategories/subcategories.component';
import { RegisteredusersComponent } from 'app/registeredusers/registeredusers.component';
import { Dashboard2Component } from 'app/dashboard2/dashboard2.component';
import { UserpostsComponent } from 'app/userposts/userposts.component';
import { RsspostsComponent } from 'app/rssposts/rssposts.component';
import { BannersComponent } from 'app/banners/banners.component';
import { AddsComponent } from 'app/adds/adds.component';
import { PageownersComponent } from 'app/pageowners/pageowners.component';
import { AbusepostsComponent } from 'app/abuseposts/abuseposts.component';
import { TrendingcategoriesComponent } from 'app/trendingcategories/trendingcategories.component';
import { TrendingpostsComponent } from 'app/trendingposts/trendingposts.component';
import { MobileusersComponent } from 'app/mobileusers/mobileusers.component';
import { WebusersComponent } from 'app/webusers/webusers.component';
import { RolemanagementComponent } from 'app/rolemanagement/rolemanagement.component';
import { EnquiriesComponent } from 'app/enquiries/enquiries.component';
import { PagesComponent } from 'app/pages/pages.component';
import { PollsComponent } from 'app/polls/polls.component';
import { UserpagesComponent } from 'app/userpages/userpages.component';
import { HeroimagesComponent } from 'app/heroimages/heroimages.component';
import { LivesComponent } from 'app/lives/lives.component';
import { CreatePostComponent } from 'app/create-post/create-post.component';
import { AddsInPostsComponent } from 'app/adds-in-posts/adds-in-posts.component';
import { ConfigurationsComponent } from 'app/configurations/configurations.component';
import { ScratchcardComponent } from 'app/scratchcard/scratchcard.component';
import { LeaderboardComponent } from 'app/leaderboard/leaderboard.component';
import { PackagesComponent } from 'app/packages/packages.component';
import { MembersComponent } from 'app/members/members.component';
import { ReferredScratchcardComponent } from 'app/referred-scratchcard/referred-scratchcard.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'rss_console', component: Dashboard2Component },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'table-list', component: TableListComponent },
    { path: 'typography', component: TypographyComponent },
    { path: 'icons', component: IconsComponent },
    { path: 'maps', component: MapsComponent },
    { path: 'notifications', component: NotificationsComponent },
    { path: 'upgrade', component: UpgradeComponent },
    { path: 'main_categories', component: CategoriesComponent },
    { path: 'sub_categories', component: SubcategoriesComponent },
    { path: 'registered_users', component: RegisteredusersComponent },
    { path: 'user_posts', component: UserpostsComponent },
    { path: 'rss_posts', component: RsspostsComponent },
    { path: 'banners', component: BannersComponent },
    { path: 'adds', component: AddsComponent },
    { path: 'pageowners', component: PageownersComponent },
    { path: 'abuse_posts', component: AbusepostsComponent },
    { path: 'trending_categories', component: TrendingcategoriesComponent },
    { path: 'trending_posts', component: TrendingpostsComponent },
    { path: 'mobile_users', component: MobileusersComponent },
    { path: 'web_users', component: WebusersComponent },
    { path: 'role_management', component: RolemanagementComponent },
    { path: 'enquiries', component: EnquiriesComponent },
    { path: 'rss_pages', component: PagesComponent },
    { path: 'polls', component: PollsComponent },
    { path: 'user_pages', component: UserpagesComponent },
    { path: 'hero_images', component: HeroimagesComponent },
    { path: 'lives', component: LivesComponent },
    { path: 'create_post', component: CreatePostComponent },
    { path: 'adds_in_posts_or_live', component: AddsInPostsComponent },
    { path: 'configurations', component: ConfigurationsComponent },
    { path: 'user_scratchcard', component: ScratchcardComponent },
    { path: 'scratch_card_leaderboard', component: LeaderboardComponent },
    { path: 'packages', component: PackagesComponent },
    { path: 'members', component: MembersComponent },
    { path: 'referred_scratchcard', component: ReferredScratchcardComponent }
];
