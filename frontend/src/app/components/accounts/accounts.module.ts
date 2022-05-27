import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsComponent } from './accounts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccountComponent } from './account/account.component';

@NgModule({
  declarations: [AccountsComponent, AccountComponent],
  imports: [CommonModule, SharedModule],
  exports: [AccountsComponent, AccountsComponent],
})
export class AccountsModule {}
