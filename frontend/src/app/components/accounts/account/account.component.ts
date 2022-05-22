import { Component, Input, OnInit } from '@angular/core';
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
  @Input() accounts!: AccountsResponce['data'];
  active: number = 0;

  ngOnInit(): void {
    if (this.accounts) {
      this.accountsService.updateCurrentId(this.accounts[0]._id);
    }
  }

  onEditAccountButtonClicked(account: any) {
    const data = {
      title: 'Account',
      account: account,
    };

    this.sidenavService.setSidenavData$(data);
    this.sidenavService.showSideNav();
  }

  setActive(index: number, id: string) {
    if (this.active !== index) {
      this.active = index;
      this.accountsService.updateCurrentId(id);
    }
  }
}
