import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TransactionService } from './services/transaction.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  @Input() type!: string;
  selectedFilterType: string = 'all';
  selectedFilterDate: string = 'latest';
  currentID: string = '';

  subscription: Subscription = new Subscription();

  transactions!: ITransaction;

  search_request(request: string) {
    console.log(request);
  }

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

  constructor(private transactionService: TransactionService) {}

  fillTransactions() {
    this.transactionService.getTransactions().subscribe((result) => {
      if (result !== null && result.success) {
        this.transactions = result.data;
      }
    });
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

export interface ITransaction {
  user: string;
  card: string;
  title: string;
  categories: {
    _id: string;
    // name: string;
    // type: string;
  }[];
  amount: number;
  date: Date;
  description: string;
  attachment: string;
  payee: string;
}
[];
