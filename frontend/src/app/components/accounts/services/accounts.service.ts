import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, asyncScheduler, Subject } from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { AccountsResponce } from '../models/accountsResponceModel';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerService } from '../../spinner/services/spinner.service';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  constructor(
    private httpClient: HttpClient,
    private _snackBar: MatSnackBar,
    private spinnerService: SpinnerService
  ) {}

  private isUpdated$: Subject<boolean> = new BehaviorSubject<boolean>(false);
  private isIdUpdated$: Subject<boolean> = new BehaviorSubject<boolean>(false);
  private currentId$: Subject<string> = new BehaviorSubject<string>('');
  private currentCurrency$: Subject<string> = new BehaviorSubject<string>('');

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 5000 });
    this.spinnerService.hideSpinner();
  }

  createAccount(data: {
    currency: string;
    title: string;
    // type: string;
    description: string;
  }) {
    return this.httpClient.post<AccountsResponce>(
      `${environment.api}accounts/create`,
      data
    );
  }

  getUserAccounts() {
    this.spinnerService.showSpinner();
    return this.httpClient.get<AccountsResponce>(`${environment.api}accounts/`);
  }

  editAccount(
    data: {
      balance: number;
      currency: string;
      title: string;
      type: string;
      _id: string;
      description: string;
    },
    id: string
  ) {
    this.spinnerService.showSpinner();
    return this.httpClient
      .put<AccountsResponce>(`${environment.api}accounts/update/${id}`, data)
      .subscribe((result) => {
        if (result.success) {
          this.openSnackBar('Account changed successfully!', 'Done');
          this.requestUpdate();
        }
      });
  }

  deleteAccount(id: string) {
    this.spinnerService.showSpinner();
    return this.httpClient
      .delete<AccountsResponce>(`${environment.api}accounts/delete/${id}`)
      .subscribe((result) => {
        if (result.success) {
          this.openSnackBar('Account successfully deleted!', 'Done');
          this.requestUpdate();
        }
      });
  }

  shouldUpdate$() {
    return this.isUpdated$.asObservable().pipe(observeOn(asyncScheduler));
  }

  shouldIdUpdate$() {
    return this.isIdUpdated$.asObservable().pipe(observeOn(asyncScheduler));
  }

  requestUpdate() {
    this.isUpdated$.next(true);
  }

  declineUpdate() {
    this.spinnerService.hideSpinner();
    this.isUpdated$.next(false);
  }

  idUpdate() {
    this.isIdUpdated$.next(true);
  }

  completeIdUpdate() {
    this.isIdUpdated$.next(false);
  }

  updateCurrentId(id: string) {
    this.idUpdate();
    this.currentId$.next(id);
  }

  getCurrentID$() {
    return this.currentId$.asObservable().pipe(observeOn(asyncScheduler));
  }

  updateCurrentCurrency(currency: string) {
    this.currentCurrency$.next(currency);
  }

  getCurrentCurrency$() {
    return this.currentCurrency$.asObservable().pipe(observeOn(asyncScheduler));
  }
}
