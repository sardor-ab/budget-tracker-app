import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountsService } from '../../accounts/services/accounts.service';
import { DialogService } from '../../dialog/services/dialog.service';

@Injectable({
  providedIn: 'root',
})
export class ActionsService {
  constructor(
    private accountsService: AccountsService,
    private dialogService: DialogService
  ) {}
  result: boolean = false;
  subscription: Subscription = new Subscription();

  noAccounts(): boolean {
    this.subscription = this.accountsService
      .getUserAccounts()
      .subscribe((result) => {
        if (result) {
          this.result = result.success;
        }
      });

    return this.result;
  }

  addingNew(type: string): void {
    return this.dialogService.showDialog(`New ${type} Details`, type);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
