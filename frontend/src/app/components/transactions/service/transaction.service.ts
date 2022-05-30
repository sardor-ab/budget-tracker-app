import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  BehaviorSubject,
  asyncScheduler,
  Subject,
  Subscription,
  of,
} from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountsService } from '../../accounts/services/accounts.service';
import {
  IItemsResponceModel,
  ITransaction,
} from 'src/app/models/ResponceModels';
import { SpinnerService } from '../../spinner/services/spinner.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(
    private _snackBar: MatSnackBar,
    private httpClient: HttpClient,
    private spinnerService: SpinnerService,
    private accountsService: AccountsService
  ) {
    this.subscription = this.accountsService
      .getCurrentID$()
      .subscribe((id: string) => {
        if (id) {
          this.getTransactions(id, this.filterType, this.filterDate);
        }
      });
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 5000 });
  }

  subscription: Subscription = new Subscription();

  private filterType: string = 'all';
  setFilterType(filterType: string) {
    this.filterType = filterType;
    this.getTransactions(this.cardID, this.filterType, this.filterDate);
  }
  private filterDate: string = 'lates';
  setFilterDate(filterDate: string) {
    this.filterDate = filterDate;
    this.getTransactions(this.cardID, this.filterType, this.filterDate);
  }

  private cardID: string = '';

  private getResponce$: Subject<IItemsResponceModel> =
    new BehaviorSubject<IItemsResponceModel>({
      success: false,
      message: '',
      transactions: [],
    });

  getTransactionList$() {
    this.spinnerService.showSpinner();
    return this.getResponce$.asObservable().pipe(observeOn(asyncScheduler));
  }

  getTransactions(id: string, filterType: string, filterDate: string) {
    if (!id) {
      return of<IItemsResponceModel>({
        success: false,
        message: 'No transactions found!',
        transactions: [],
      });
    }

    this.cardID = id;

    return this.httpClient
      .get<IItemsResponceModel>(
        `${environment.api}transactions/${id}?type=${filterType}&date=${filterDate}`
      )
      .subscribe((result) => {
        this.getResponce$.next(result);
        this.spinnerService.hideSpinner();
      });
  }

  editTransaction(data: ITransaction, transactionID: string) {
    this.spinnerService.showSpinner();

    return this.httpClient
      .put<IItemsResponceModel>(
        `${environment.api}transactions/update/?card=${this.cardID}&transaction=${transactionID}`,
        data
      )
      .subscribe((result) => {
        this.getTransactions(this.cardID, 'all', 'lates');
        this.accountsService.requestUpdate();
        this.openSnackBar(result.message!, 'Done');
        this.spinnerService.hideSpinner();
      });
  }

  createTransaction(data: ITransaction) {
    this.spinnerService.showSpinner();

    data.card = this.cardID;

    return this.httpClient
      .post<IItemsResponceModel>(`${environment.api}transactions/create`, data)
      .subscribe((result) => {
        this.getResponce$.next(result);
        this.accountsService.requestUpdate();
        this.openSnackBar(result.message!, 'Done');
        this.spinnerService.hideSpinner();
      });
  }

  deleteTransaction(cardID: string, transactionID: string) {
    this.spinnerService.showSpinner();

    return this.httpClient
      .delete<IItemsResponceModel>(
        `${environment.api}transactions/delete/?card=${cardID}&transaction=${transactionID}`
      )
      .subscribe((result) => {
        this.getResponce$.next(result);
        this.accountsService.requestUpdate();
        this.openSnackBar('Transaction deleted successfully!', 'Done');
        this.spinnerService.hideSpinner();
      });
  }
}
