import { Injectable } from '@angular/core';
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

  noAccounts() {
    return this.accountsService.getUserAccounts();
  }

  addingNew(type: string): void {
    return this.dialogService.showDialog(`New ${type} Details`, type);
  }
}
