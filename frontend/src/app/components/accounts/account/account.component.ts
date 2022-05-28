import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SidenavService } from '../../sidenav/services/sidenav.service';
import { AccountsResponce } from '../models/accountsResponceModel';
import { AccountsService } from '../services/accounts.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  constructor(
    private sidenavService: SidenavService,
    private accountsService: AccountsService
  ) {}
  subscription: Subscription = new Subscription();
  @Input() accounts!: AccountsResponce['data'];
  active: number = 0;

  ngOnInit(): void {
    if (this.accounts) {
      this.accountsService.updateCurrentId(this.accounts[0]._id);
      this.accountsService.updateCurrentCurrency(this.accounts[0].currency);
    }

    this.subscription = this.accountsService
      .getIndex$()
      .subscribe((index: number) => {
        this.active = index;
      });
  }

  onEditAccountButtonClicked(account: any) {
    const data = {
      title: 'Account',
      account: account,
    };

    this.sidenavService.setSidenavData$(data);
    this.sidenavService.showSideNav();
  }

  setActive(index: number, account: any) {
    if (this.active !== index) {
      this.active = index;
      this.accountsService.updateCurrentId(account._id);
      this.accountsService.updateCurrentCurrency(account.currency);
    }
  }
}
