import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CampaignsComponent } from './pages/campaigns/campaigns.component';
import { CampaignDetailsComponent } from './pages/campaign-details/campaign-details.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AssociationProfile } from './pages/association-profile/association-profile.component';
import { AssociationDashboard } from './pages/association-dashboard/association-dashboard.component';
import { CreateCampaign } from './pages/create-campaign/create-campaign.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'campaigns', component: CampaignsComponent },
    { path: 'campaigns/:id', component: CampaignDetailsComponent },
    { path: 'profile', component: UserProfileComponent },
    { path: 'admin', component: AdminDashboardComponent },
    { path: 'association-profile', component: AssociationProfile },
    { path: 'association-dashboard', component: AssociationDashboard },
    { path: 'create-campaign', component: CreateCampaign },
    { path: '**', redirectTo: '' }
];
