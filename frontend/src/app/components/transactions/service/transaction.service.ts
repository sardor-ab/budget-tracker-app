import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, asyncScheduler, Subject, Subscription } from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { AccountsService } from '../../accounts/services/accounts.service';
import {
  IItemsResponceModel,
  ITransaction,
} from 'src/app/models/ResponceModels';
import { SpinnerService } from '../../spinner/services/spinner.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
          this.id = id;
          this.requestUpdate();
        }
      });
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 5000 });
  }

  subscription: Subscription = new Subscription();
  private id: string = '';
  private cardID: string = '';
  private transactionID: string = '';

  private getResponce$ = new BehaviorSubject<IItemsResponceModel>({
    success: false,
    message: '',
    transactions: [],
  });

  private shouldFill$: Subject<boolean> = new BehaviorSubject<boolean>(false);

  private shouldUpdated$: Subject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  currentUpdateState$() {
    return this.shouldUpdated$.asObservable().pipe(observeOn(asyncScheduler));
  }

  requestUpdate(): void {
    this.shouldUpdated$.next(true);
  }

  completeUpdate(): void {
    this.shouldUpdated$.next(false);
  }

  private addingNewTransaction$: Subject<boolean> =
    new BehaviorSubject<boolean>(false);
  private newTransactionData$ = new BehaviorSubject<ITransaction>({
    user: '',
    title: '',
    type: '',
    categories: [],
    amount: 0,
    payee: '',
    date: new Date(),
    description: '',
    card: '',
    attachment: '',
  });

  setNewTransactionData(data: ITransaction) {
    this.newTransactionData$.next(data);
  }

  startAddingNewTransaction() {
    this.addingNewTransaction$.next(true);
    this.spinnerService.showSpinner();
  }

  completeAddingNewTransaction() {
    this.addingNewTransaction$.next(false);
    this.spinnerService.hideSpinner();
  }

  isNewTransaction$() {
    return this.addingNewTransaction$
      .asObservable()
      .pipe(observeOn(asyncScheduler));
  }
  currentFillState$() {
    return this.shouldFill$.asObservable().pipe(observeOn(asyncScheduler));
  }

  getTransactionList$() {
    return this.getResponce$.getValue();
  }

  fillState(state: boolean) {
    this.shouldFill$.next(state);
  }

  getTransactions(filterType: string, filterDate: string) {
    this.completeUpdate();

    return this.httpClient
      .get<IItemsResponceModel>(
        `${environment.api}transactions/${this.id}?type=${filterType}&date=${filterDate}`
      )
      .subscribe((result) => {
        if (result.success) {
          this.getResponce$.next(result);
          this.fillState(true);
        }
      });
  }
  private transactionToUpdate$ = new BehaviorSubject<ITransaction>({
    user: '',
    title: '',
    type: '',
    categories: [],
    amount: 0,
    payee: '',
    date: new Date(),
    description: '',
    card: '',
    attachment: '',
  });
  private updateTransaction$: Subject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  setTransactionDataToUpdate(data: ITransaction, cardID: string, id: string) {
    this.cardID = cardID;
    this.transactionID = id;
    this.transactionToUpdate$.next(data);
  }

  shouldUpdateTransaction$() {
    return this.updateTransaction$
      .asObservable()
      .pipe(observeOn(asyncScheduler));
  }

  updateTransaction() {
    this.updateTransaction$.next(true);
  }

  transactionUpdated$() {
    this.accountsService.requestUpdate();
    this.updateTransaction$.next(false);
  }

  editTransaction() {
    this.completeUpdate();
    this.spinnerService.showSpinner();

    return this.httpClient
      .put<IItemsResponceModel>(
        `${environment.api}transactions/update/?card=${this.cardID}&transaction=${this.transactionID}`,
        this.transactionToUpdate$.getValue()
      )
      .subscribe((result) => {
        if (result.success) {
          this.spinnerService.hideSpinner();
          this.accountsService.requestUpdate();
          this.transactionUpdated$();
          this.requestUpdate();
        }
        this.openSnackBar(result.message!, 'Done');
      });
  }

  createTransaction() {
    return this.httpClient
      .post<IItemsResponceModel>(
        `${environment.api}transactions/create`,
        this.newTransactionData$.getValue()
      )
      .subscribe((result) => {
        if (result.success) {
          this.spinnerService.hideSpinner();
          this.accountsService.requestUpdate();
          this.completeAddingNewTransaction();
          this.requestUpdate();
        }
        this.openSnackBar(result.message!, 'Done');
      });
  }

  deleteTransaction(cardID: string, transactionID: string) {
    this.spinnerService.showSpinner();
    return this.httpClient
      .delete<IItemsResponceModel>(
        `${environment.api}transactions/delete/?card=${cardID}&transaction=${transactionID}`
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
