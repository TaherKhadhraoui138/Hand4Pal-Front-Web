import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CampaignsComponent } from './pages/campaigns/campaigns.component';
import { CampaignDetailsComponent } from './pages/campaign-details/campaign-details.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'campaigns', component: CampaignsComponent },
    { path: 'campaigns/:id', component: CampaignDetailsComponent },
    { path: '**', redirectTo: '' }
];
