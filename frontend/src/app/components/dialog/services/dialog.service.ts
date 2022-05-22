import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { BehaviorSubject, asyncScheduler, Subject } from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { AccountsService } from '../../accounts/services/accounts.service';
import { TransactionService } from '../../transactions/services/transaction.service';
import { DialogComponent } from '../dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(
    private dialog: MatDialog,
    private accountsService: AccountsService,
    private transactionService: TransactionService,
    private _snackBar: MatSnackBar
  ) {
    this.subscription = this.accountsService
      .getCurrentID$()
      .subscribe((id: string) => {
        this.cardID = id;
      });
  }

  private openDialog$: Subject<boolean> = new BehaviorSubject<boolean>(false);
  private dialogMessage = new BehaviorSubject<string>('');
  public showMessage = this.dialogMessage.asObservable();
  subscription: Subscription = new Subscription();
  cardID: string = '';

  provideMessage(message: string) {
    this.dialogMessage.next(message);
  }

  isOpenDialog$() {
    return this.openDialog$.asObservable().pipe(observeOn(asyncScheduler));
  }

  getMessage() {
    return this.dialogMessage.getValue();
  }

  showDialog(title: string, type: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      restoreFocus: false,
      data: {
        title,
        message: this.getMessage(),
        type,
      },
    });

    dialogRef.afterClosed().subscribe((data) => {
      this.openDialog$.next(false);
    });
    // this.openDialog$.next(true);
  }

  hideDialog() {
    this.openDialog$.next(false);
    this.subscription.unsubscribe();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 5000 });
  }

  createAccount(data: Data['account']): void {
    this.subscription = this.accountsService
      .createAccount(data!)
      .subscribe((result) => {
        if (result.success) {
          this.accountsService.requestUpdate();
          this.openSnackBar('Account added successfully!', 'Done');
        }
      });
  }

  createTransaction(data: Data['transaction']): void {
    if (data) {
      data.card = this.cardID;
    }

    this.subscription = this.transactionService
      .createTransaction(data!)
      .subscribe((result) => {
        if (result.success) {
          this.transactionService.requestUpdate();
          this.openSnackBar(result.message!, 'Done');
        }
      });
  }

  setCurrentCurrency() {
    return this.accountsService.getCurrentCurrency$();
  }
}

export interface Data {
  account?: {
    title: string;
    currency: string;
    description: string;
    type: string;
  };
  transaction?: {
    user: string;
    title: string;
    type: string;
    categories: [];
    amount: number;
    payee: string;
    date: Date;
    description: string;
    card: string;
    attachment: string;
  };
}
