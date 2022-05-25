import { Component, Input, OnInit } from '@angular/core';
import { SidenavService } from '../../sidenav/services/sidenav.service';
import {
  ITransaction,
  ITransactionsResModel,
} from '../services/transaction.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {
  @Input() transactions!: ITransactionsResModel['data'];
  constructor(private sidenavService: SidenavService) {}

  ngOnInit(): void {}

  editTransaction(transaction: any) {
    const data = {
      title: 'Transaction',
      transaction: transaction,
    };

    this.sidenavService.setSidenavData$(data);
    this.sidenavService.showSideNav();
  }
}
