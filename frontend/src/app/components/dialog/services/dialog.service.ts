import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { BehaviorSubject, asyncScheduler, Subject } from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { AccountsService } from '../../accounts/services/accounts.service';
import { DialogComponent } from '../dialog.component';
import { TransactionService } from '../../transactions/service/transaction.service';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private accountsService: AccountsService
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
  private durationValue$: Subject<string> = new BehaviorSubject<string>(
    '12 months'
  );
  private defaultDurationValue: {
    number: number;
    unit: string;
  } = {
    number: 12,
    unit: 'months',
  };

  private chosenDurationValue$: Subject<{ number: number; unit: string }> =
    new BehaviorSubject<{ number: number; unit: string }>({
      number: 12,
      unit: 'months',
    });

  getChosenDurationValue$() {
    return this.chosenDurationValue$
      .asObservable()
      .pipe(observeOn(asyncScheduler));
  }

  setChosenDurationValue(value: { number: number; unit: string }) {
    this.chosenDurationValue$.next(value);
  }

  getDurationValue$() {
    return this.durationValue$.asObservable().pipe(observeOn(asyncScheduler));
  }

  setDuration(duration: string) {
    this.durationValue$.next(duration);
  }

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
        date: this.defaultDurationValue,
      },
    });

    dialogRef.afterClosed().subscribe((data) => {
      this.openDialog$.next(false);
      // if (data && data === 'close') {
      //   this.showDialog('Notification', 'Notification');
      // }
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
