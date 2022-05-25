import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  BehaviorSubject,
  asyncScheduler,
  Subject,
  Subscription,
  of,
} from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { AccountsService } from '../../accounts/services/accounts.service';
import { SpinnerService } from '../../spinner/services/spinner.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(
    private httpClient: HttpClient,
    private accountsService: AccountsService,
    private spinnerService: SpinnerService,
    private _snackBar: MatSnackBar
  ) {
    this.subscription = this.accountsService
      .getCurrentID$()
      .subscribe((id: string) => {
        if (id) {
          this.id = id;
          this.requestUpdate();
        }
      });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 5000 });
    this.spinnerService.hideSpinner();
  }

  subscription: Subscription = new Subscription();

  id: string = '';
  private isUpdated$: Subject<boolean> = new BehaviorSubject<boolean>(false);

  shouldUpdate$() {
    return this.isUpdated$.asObservable().pipe(observeOn(asyncScheduler));
  }

  requestUpdate() {
    this.isUpdated$.next(true);
  }

  completeUpdate() {
    this.isUpdated$.next(false);
    this.spinnerService.hideSpinner();
  }

  getTransactions(filterType: string, filterDate: string) {
    this.spinnerService.showSpinner();
    this.completeUpdate();

    return this.httpClient.get<ITransactionsResModel>(
      `${environment.api}transactions/${this.id}?type=${filterType}&date=${filterDate}`
    );
  }

  createTransaction(data: ITransaction) {
    return this.httpClient.post<ITransactionsResModel>(
      `${environment.api}transactions/create`,
      data
    );
  }

  editTransaction(data: ITransaction, cardID: string, id: string) {
    this.spinnerService.showSpinner();
    return this.httpClient
      .put<ITransactionsResModel>(
        `${environment.api}transactions/update/?card=${cardID}&transaction=${id}`,
        data
      )
      .subscribe((result) => {
        if (result.success) {
          this.openSnackBar('Transaction changed successfully!', 'Done');
          this.accountsService.requestUpdate();
          this.requestUpdate();
        }
      });
  }

  deleteTransaction(cardID: string, id: string) {
    this.spinnerService.showSpinner();
    return this.httpClient
      .delete<ITransactionsResModel>(
        `${environment.api}transactions/delete/?card=${cardID}&transaction=${id}`
      )
      .subscribe((result) => {
        if (result.success) {
          this.openSnackBar('Transaction deleted successfully!', 'Done');
          this.accountsService.requestUpdate();
          this.requestUpdate();
        }
      });
  }
}

export interface ITransactionsResModel {
  success: boolean;
  message?: string;
  data?: ITransaction[];
}

export interface ITransaction {
  user: string;
  card: string;
  title: string;
  categories: {
    _id: string;
    // name: string;
    // type: string;
  }[];
  amount: number;
  date: Date;
  description: string;
  attachment: string;
  payee: string;
  type: string;
}
