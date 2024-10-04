import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuardService } from './guards/auth.guard';
import { dashboardDataResolver } from './resolvers/dashboard-data.resolver';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(mod => mod.DashboardComponent),
    canLoad: [() => inject(AuthGuardService).isLoggedIn()],
    resolve: { dashboardData: dashboardDataResolver }
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
