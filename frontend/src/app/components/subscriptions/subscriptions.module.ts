import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { SubscriptionsComponent } from './subscriptions.component';

@NgModule({
  declarations: [SubscriptionsComponent],
  imports: [CommonModule, SharedModule],
  exports: [SubscriptionsComponent],
})
export class SubscriptionsModule {}
