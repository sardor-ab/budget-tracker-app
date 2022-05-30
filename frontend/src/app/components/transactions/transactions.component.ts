import { Component, Input, OnInit } from '@angular/core';
import { ITransaction } from 'src/app/models/ResponceModels';
import { Subscription } from 'rxjs';
import { SidenavService } from '../sidenav/services/sidenav.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  constructor(private sidenavService: SidenavService) {}

  @Input() transactions!: ITransaction[];
  @Input() noItems!: boolean;

  subscription: Subscription = new Subscription();

  ngOnInit(): void {}

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
