import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { homeRoutes } from './modules/home/home.routes';
import { AuthComponent } from './modules/auth/auth.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: homeRoutes
    },
    {
        path: 'iniciar',
        component: AuthComponent,
    },
    {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
    }
];
