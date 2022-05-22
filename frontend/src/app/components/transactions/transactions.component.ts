import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpinnerService } from '../spinner/services/spinner.service';
import {
  ITransactionsResModel,
  TransactionService,
} from './services/transaction.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  constructor(
    private transactionService: TransactionService,
    private spinnerService: SpinnerService
  ) {}
  @Input() type!: string;
  selectedFilterType: string = 'all';
  selectedFilterDate: string = 'latest';
  currentID: string = '';

  subscription: Subscription = new Subscription();

  transactions!: ITransactionsResModel['data'];

  noTransactions: boolean = true;

  search_request(request: string) {
    console.log(request);
  }

  // STATIC DATA
  types = [
    {
      label: 'income',
      icon: 'arrow_upward',
      method: () => this.sortByType('income'),
    },
    {
      label: 'expence',
      icon: 'arrow_downward',
      method: () => this.sortByType('expence'),
    },
  ];

  dates = [
    {
      label: 'latest',
      icon: 'arrow_downward',
      method: () => this.sortByDate('latest'),
    },
    {
      label: 'oldest',
      icon: 'arrow_upward',
      method: () => this.sortByDate('oldest'),
    },
  ];
  // !STATIC DATA

  // SORTING
  sortByDate(filter: string) {
    this.selectedFilterDate = filter;
  }

  sortByType(filter: string) {
    if (filter !== this.selectedFilterType) {
      this.selectedFilterType = filter;
    } else {
      this.selectedFilterType = 'all';
    }
  }
  // !SORTING

  fillTransactions() {
    this.subscription = this.transactionService
      .getTransactions()
      .subscribe((result) => {
        if (result !== null && result.success) {
          this.transactions = result.data;
          this.noTransactions = false;
        } else {
          this.noTransactions = true;
        }
      });
    this.spinnerService.hideSpinner();
  }

  ngOnInit(): void {
    this.subscription = this.transactionService
      .shouldUpdate$()
      .subscribe((state) => {
        if (state) {
          this.fillTransactions();
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
