import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IItemsResponceModel } from 'src/app/models/ResponceModels';
import { SpinnerService } from '../../spinner/services/spinner.service';
import { TransactionService } from '../../transactions/service/transaction.service';
import { ListService } from '../services/list.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  constructor(
    private listService: ListService,
    private spinnerService: SpinnerService,
    private transactionService: TransactionService
  ) {}

  @Input() type!: string;

  subscription: Subscription = new Subscription();

  selectedFilterType: string = 'all';
  selectedFilterDate: string = 'latest';

  showTransactions: boolean = false;
  showCategories: boolean = false;
  canUseFilters: boolean = true;
  noItems: boolean = false;

  transactions!: IItemsResponceModel['transactions'];
  categories!: IItemsResponceModel['categories'];

  // STATIC DATA
  types: IFilter[] = [
    {
      label: 'income',
      icon: 'arrow_upward',
      method: () => this.sortByType('income'),
    },
    {
      label: 'expense',
      icon: 'arrow_downward',
      method: () => this.sortByType('expense'),
    },
  ];

  dates: IFilter[] = [
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

  ngOnInit(): void {
    if (this.type === 'transactions') {
      this.showTransactions = true;
    }
    this.subscription = this.transactionService
      .currentUpdateState$()
      .subscribe((state) => {
        if (state) {
          this.transactionService.getTransactions(
            this.selectedFilterType,
            this.selectedFilterDate
          );
        }
      });

    this.subscription = this.transactionService
      .currentFillState$()
      .subscribe((state) => {
        if (state) {
          this.transactions =
            this.transactionService.getTransactionList$().transactions;
          this.transactionService.fillState(false);
        }
      });
  }

  // SORTING
  sortByDate(filter: string): void {
    this.selectedFilterDate = filter;
    this.transactionService.requestUpdate();
  }

  sortByType(filter: string): void {
    if (filter !== this.selectedFilterType) {
      this.selectedFilterType = filter;
    } else {
      this.selectedFilterType = 'all';
    }
    this.transactionService.requestUpdate();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

interface IFilter {
  label: string;
  icon: string;
  method(): void;
}
