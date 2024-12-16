import { Routes } from '@angular/router';

import { PersonaLayoutComponent } from './layout/persona-layout/persona-layout.component';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { DashComponent } from './views/dash/dash.component';

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
            },
            
            {
                path: 'dash',
                component: DashComponent,
            }
        ]
    }
];

