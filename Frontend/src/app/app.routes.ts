import { Routes } from '@angular/router';

import { PersonaLayoutComponent } from './layout/persona-layout/persona-layout.component';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { DashComponent } from './views/dash/dash.component';
import { LoginComponent } from './views/login/login.component';
import { MasarifComponent } from './views/masarif/masarif.component';
import { Mada5ilComponent } from './views/mada5il/mada5il.component';
import { ProfileComponent } from './views/profile/profile.component';
import { GoalsComponent } from './views/goals/goals.component';
import { sign } from 'crypto';
import { SignInComponent } from './views/sign-in/sign-in.component';
import { authGuard } from './services/auth.guard';
import { notauthGuard } from './services/notauth.guard';

export const routes: Routes = [
    /*{ path: 'dashboard', component: DashboardComponent },
    { path: 'inbox', component: InboxComponent },
    { path: 'users', component: UsersComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'sign-in', component: SignInComponent },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }  */
    {
        path: '',
        component: PersonaLayoutComponent,
        
        children: [
            {
                path: '',
                component: LandingPageComponent,
                //canActivate:[notauthGuard]
            },
            
            {
                path: 'dashboard',
                component: DashComponent,
                canActivate:[authGuard]
            },
            {
                path: 'login',
                component: LoginComponent,
                canActivate:[notauthGuard]
            },
            {
                path:'masarif',
                component:MasarifComponent,
                canActivate:[authGuard]
            },
            {
                path:'mada5il',
                component:Mada5ilComponent,
                canActivate:[authGuard]
            },
            {
                path:'profile',
                component:ProfileComponent,
                canActivate:[authGuard]
            },
            {
                path:'goals',
                component:GoalsComponent,
                canActivate:[authGuard]
            },
            {
                path:'signin',
                component:SignInComponent,
                canActivate:[notauthGuard]
            },
            
        ]
    }
];

