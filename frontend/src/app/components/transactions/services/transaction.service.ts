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

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(
    private httpClient: HttpClient,
    private accountsService: AccountsService,
    private spinnerService: SpinnerService
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
  }

  getTransactions() {
    this.spinnerService.showSpinner();
    this.completeUpdate();
    // if (this.id) {
    //   return this.httpClient.get<ITransactionsResModel>(
    //     `${environment.api}transactions/${this.id}`
    //   );
    // }

    return this.httpClient.get<ITransactionsResModel>(
      `${environment.api}transactions/${this.id}`
    );

    // return of<ITransactionsResModel>({
    //   success: false,
    //   data: {
    //     user: '',
    //     card: '',
    //     title: '',
    //     categories: [],
    //     amount: 0,
    //     date: new Date(),
    //     description: '',
    //     attachment: '',
    //     payee: '',
    //   },
    // });
  }

  createTransaction(data: ITransaction) {
    return this.httpClient.post<ITransactionsResModel>(
      `${environment.api}transactions/create`,
      data
    );
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
}
