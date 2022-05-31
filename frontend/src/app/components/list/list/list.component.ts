import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { IItemsResponceModel } from 'src/app/models/ResponceModels';
import { CategoryService } from '../../categories/service/category.service';
import { TransactionService } from '../../transactions/service/transaction.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private _snackBar: MatSnackBar
  ) {}

  @Input() type!: string;

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 5000 });
  }

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
      icon: 'arrow_downward',
      method: () => this.sortByType('income'),
    },
    {
      label: 'expense',
      icon: 'arrow_upward',
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
    switch (this.type) {
      case 'transactions':
        this.subscription = this.transactionService
          .getTransactionList$()
          .subscribe((result) => {
            this.transactions = result.transactions;
            this.noItems = this.transactions?.length === 0;
            this.canUseFilters = result.success;
          });
        break;

      case 'categories':
        this.subscription = this.categoryService
          .getCategoryList$()
          .subscribe((result) => {
            this.categories = result.categories;
            this.noItems = this.categories?.length === 0;
            this.canUseFilters = result.success;
          });
        break;
    }
  }

  // SORTING
  sortByDate(filter: string): void {
    this.selectedFilterDate = filter;
    this.transactionService.setFilterDate(this.selectedFilterDate);
  }

  sortByType(filter: string): void {
    if (filter !== this.selectedFilterType) {
      this.selectedFilterType = filter;
    } else {
      this.selectedFilterType = 'all';
    }
    switch (this.type) {
      case 'transactions':
        this.transactionService.setFilterType(this.selectedFilterType);
        break;
      case 'categories':
        this.categoryService.setFilterType(this.selectedFilterType);
        break;
    }
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
