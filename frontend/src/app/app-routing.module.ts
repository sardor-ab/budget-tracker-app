import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './components/login/form/form.component';
import { RegisterFormComponent } from './components/registration/register-form/register-form.component';
import { AuthGuard } from './config/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'login',
    component: FormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'register',
    component: RegisterFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./components/dashboard/dashboard.module').then(
        (module) => module.DashboardModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'categories',
    loadChildren: () =>
      import('./components/page-categories/page-categories.module').then(
        (module) => module.PageCategoriesModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'subscriptions',
    loadChildren: () =>
      import('./components/page-subscriptions/page-subscriptions.module').then(
        (module) => module.PageSubscriptionsModule
      ),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
