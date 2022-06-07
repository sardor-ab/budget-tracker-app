import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageSubscriptionsComponent } from './page-subscriptions/page-subscriptions.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListModule } from '../list/list.module';
import { ActionsModule } from '../actions/actions.module';
import { AccountsModule } from '../accounts/accounts.module';

const routes: Routes = [
  {
    path: '',
    component: PageSubscriptionsComponent,
  },
];

@NgModule({
  declarations: [PageSubscriptionsComponent],
  imports: [
    CommonModule,
    SharedModule,
    ListModule,
    ActionsModule,
    AccountsModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule, PageSubscriptionsComponent],
})
export class PageSubscriptionsModule {}
