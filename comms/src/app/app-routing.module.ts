import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationGuard } from './shared/guards/authorization/authorization.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home', pathMatch: 'full'
  },
  {
    path: 'home',
    title: 'Home - Comms',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
    canActivate: [AuthorizationGuard]
  },
  {
    path: 'about',
    title: 'About - Comms',
    loadChildren: () => import('./modules/about/about.module').then(m => m.AboutModule),
    canActivate: [AuthorizationGuard]
  },
  {
    path: 'not-authorized',
    title: 'Not Authorized - Comms',
    loadChildren: () => import('./modules/not-authorized/not-authorized.module').then(m => m.NotAuthorizedModule),
    canActivate: [AuthorizationGuard]
  },
  {
    path: '**',
    title: 'Not Found - Comms',
    loadChildren: () => import('./modules/not-found/not-found.module').then(m => m.NotFoundModule),
    canActivate: [AuthorizationGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
