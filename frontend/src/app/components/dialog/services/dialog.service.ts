import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { BehaviorSubject, asyncScheduler, Subject } from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { AccountsService } from '../../accounts/services/accounts.service';
import { DialogComponent } from '../dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(
    private dialog: MatDialog,
    private accountsService: AccountsService,
    private _snackBar: MatSnackBar
  ) {}

  private openDialog$: Subject<boolean> = new BehaviorSubject<boolean>(false);
  private dialogMessage = new BehaviorSubject<string>('');
  public showMessage = this.dialogMessage.asObservable();
  subscription: Subscription = new Subscription();

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
}

export interface Data {
  account?: {
    title: string;
    currency: string;
    description: string;
    type: string;
  };
}
