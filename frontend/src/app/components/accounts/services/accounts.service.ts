import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, asyncScheduler, Subject } from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { AccountsResponce } from '../models/accountsResponceModel';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  constructor(private httpClient: HttpClient, private _snackBar: MatSnackBar) {}

  private isUpdated$: Subject<boolean> = new BehaviorSubject<boolean>(false);

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 5000 });
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

  requestUpdate() {
    this.isUpdated$.next(true);
  }

  declineUpdate() {
    this.isUpdated$.next(false);
  }
}
