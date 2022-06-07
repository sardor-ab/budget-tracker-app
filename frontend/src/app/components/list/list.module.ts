import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TransactionsComponent } from '../transactions/transactions.component';
import { CategoriesModule } from '../categories/categories.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@NgModule({
  declarations: [ListComponent, TransactionsComponent],
  imports: [CommonModule, SharedModule, CategoriesModule, SubscriptionsModule],
  exports: [ListComponent],
})
export class ListModule {}
