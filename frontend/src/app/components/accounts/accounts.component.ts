import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountsResponce } from './models/accountsResponceModel';
import { AccountsService } from './services/accounts.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent implements OnInit {
  constructor(private accountsService: AccountsService) {}
  subscription: Subscription = new Subscription();
  accountsResponce: AccountsResponce = {
    success: false,
  };
  accounts!: AccountsResponce['data'];
  noAccounts: boolean = true;

  loadAccounts() {
    this.subscription = this.accountsService
      .getUserAccounts()
      .subscribe((data) => {
        if (data.success) {
          this.accountsResponce = data;

          this.accounts = this.accountsResponce.data;

          this.noAccounts = this.accounts?.length === 0;
        } else {
          this.noAccounts = true;
        }
        this.accountsService.declineUpdate();
      });
  }

  ngOnInit(): void {
    this.loadAccounts();
    this.subscription = this.accountsService
      .shouldUpdate$()
      .subscribe((state) => {
        if (state) {
          this.loadAccounts();
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
