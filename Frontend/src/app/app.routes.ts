import { Routes } from '@angular/router';

import { PersonaLayoutComponent } from './layout/persona-layout/persona-layout.component';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: '',
        component: PersonaLayoutComponent,
        children: [
            {
                path: '',
                component: LandingPageComponent,
            },
            {
                path: 'dashboard',
                component: DashboardComponent,
            }
        ]
    }
];
