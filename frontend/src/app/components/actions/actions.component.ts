import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountsService } from '../accounts/services/accounts.service';
import { ActionsService } from './services/actions.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent implements OnInit {
  constructor(
    private actionsService: ActionsService,
    private accountsService: AccountsService
  ) {}
  noAccounts: boolean = true;
  subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.updateAccessState();
    this.subscription = this.accountsService
      .shouldUpdate$()
      .subscribe((state) => {
        if (state) {
          this.updateAccessState();
        }
      });
  }

  updateAccessState() {
    this.subscription = this.actionsService.noAccounts().subscribe((result) => {
      if (result) {
        this.noAccounts = !result.success;
      } else {
        this.noAccounts = true;
      }
    });
  }

  onAddAccount = (): void => {
    this.actionsService.addingNew('Account');
  };

  onAddTransaction = (): void => {
    this.actionsService.addingNew('Transaction');
  };

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
