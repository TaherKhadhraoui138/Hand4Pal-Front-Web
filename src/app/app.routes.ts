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
import { AssociationCampaignDetailsComponent } from './pages/association-campaign-details/association-campaign-details.component';
import { CreateCampaign } from './pages/create-campaign/create-campaign.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'campaigns', component: CampaignsComponent },
    { path: 'campaigns/:id', component: CampaignDetailsComponent },

    // Routes protégées - nécessitent authentification
    {
        path: 'profile',
        component: UserProfileComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admin',
        component: AdminDashboardComponent,
        canActivate: [authGuard],
        data: { role: 'ADMINISTRATOR' }
    },
    {
        path: 'association-profile',
        component: AssociationProfile,
        canActivate: [authGuard],
        data: { role: 'ASSOCIATION' }
    },
    {
        path: 'association-dashboard',
        component: AssociationDashboard,
        canActivate: [authGuard],
        data: { role: 'ASSOCIATION' }
    },
    {
        path: 'association-campaigns/:id',
        component: AssociationCampaignDetailsComponent,
        canActivate: [authGuard],
        data: { role: 'ASSOCIATION' }
    },
    {
        path: 'create-campaign',
        component: CreateCampaign,
        canActivate: [authGuard],
        data: { role: 'ASSOCIATION' }
    },
    { path: '**', redirectTo: '' }
];
