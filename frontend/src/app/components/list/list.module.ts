import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TransactionsComponent } from '../transactions/transactions.component';

@NgModule({
  declarations: [ListComponent, TransactionsComponent],
  imports: [CommonModule, SharedModule],
  exports: [ListComponent],
})
export class ListModule {}
