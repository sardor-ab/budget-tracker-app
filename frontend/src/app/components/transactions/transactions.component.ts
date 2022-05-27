import { Component, Input, OnInit } from '@angular/core';
import { ITransaction } from 'src/app/models/ResponceModels';
import { Subscription } from 'rxjs';
import { SidenavService } from '../sidenav/services/sidenav.service';
import { TransactionService } from './service/transaction.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  constructor(
    private sidenavService: SidenavService,
    private transactionService: TransactionService
  ) {}

  @Input() transactions!: ITransaction[];

  subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.subscription = this.transactionService
      .isNewTransaction$()
      .subscribe((state: boolean) => {
        if (state) {
          this.transactionService.createTransaction();
          this.transactionService.completeUpdate();
        }
      });

    this.subscription = this.transactionService
      .shouldUpdateTransaction$()
      .subscribe((state) => {
        if (state) {
          this.transactionService.editTransaction();
          this.transactionService.completeUpdate();
        }
      });
  }

  editTransaction(transaction: ITransaction): void {
    const data = {
      title: 'Transaction',
      transaction: transaction,
    };

    this.sidenavService.setSidenavData$(data);
    this.sidenavService.showSideNav();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
