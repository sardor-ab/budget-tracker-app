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
        this.accountsResponce = data;
        this.noAccounts = !this.accountsResponce.success;
        this.accounts = this.accountsResponce.data;
      });
  }

  ngOnInit(): void {
    this.loadAccounts();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}