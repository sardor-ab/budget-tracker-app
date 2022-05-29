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
    private transactionService: TransactionService,
    private listService: ListService
  ) {}

  @Input() type!: string;

  subscription: Subscription = new Subscription();

  selectedFilterType: string = 'all';
  selectedFilterDate: string = 'latest';

  canUseFilters: boolean = false;
  noItems: boolean = true;

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

      method: () => this.sortByDate('latest'),
    },
    {
      label: 'oldest',

      method: () => this.sortByDate('oldest'),
    },
  ];
  // !STATIC DATA

  ngOnInit(): void {
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
          this.listService.setIsListFilled(this.transactions?.length === 0);
        }
      });

    this.subscription = this.listService
      .getIsListFilled$()
      .subscribe((state) => {
        this.noItems = state;
        this.canUseFilters = !state;
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
  icon?: string;
  method(): void;
}
