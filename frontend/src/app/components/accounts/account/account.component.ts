import { Component, Input, OnInit } from '@angular/core';
import { SidenavService } from '../../sidenav/services/sidenav.service';
import { AccountsResponce } from '../models/accountsResponceModel';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  constructor(private sidenavService: SidenavService) {}
  @Input() accounts!: AccountsResponce['data'];

  ngOnInit(): void {}

  onEditAccountButtonClicked(account: any) {
    const data = {
      title: 'Account',
      account: account,
    };

    this.sidenavService.setSidenavData$(data);
    this.sidenavService.showSideNav();
  }
}
