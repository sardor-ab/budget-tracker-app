import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccountsModule } from '../accounts/accounts.module';
import { ActionsComponent } from '../actions/actions.component';
import { ActionComponent } from '../actions/action/action.component';
import { ListModule } from '../list/list.module';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
];

@NgModule({
  declarations: [DashboardComponent, ActionsComponent, ActionComponent],
  imports: [
    CommonModule,
    SharedModule,
    AccountsModule,
    ListModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
    DashboardComponent,
    ActionsComponent,
    ActionComponent,
  ],
})
export class DashboardModule {}
