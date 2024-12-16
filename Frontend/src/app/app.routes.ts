import { Routes } from '@angular/router';

import { PersonaLayoutComponent } from './layout/persona-layout/persona-layout.component';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { DashComponent } from './views/dash/dash.component';

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
                path: 'dash',
                component: DashComponent,
            }
        ]
    }
];

