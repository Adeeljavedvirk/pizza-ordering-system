import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'order', loadComponent: () => import('./features/order/order.component').then((c) => c.OrderComponent) }
];
