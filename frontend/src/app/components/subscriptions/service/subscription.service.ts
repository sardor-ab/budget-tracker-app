import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  IItemsResponceModel,
  ISubscription,
} from 'src/app/models/ResponceModels';
import {
  BehaviorSubject,
  asyncScheduler,
  Subject,
  of,
  Subscription,
} from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerService } from '../../spinner/services/spinner.service';
import { AccountsService } from '../../accounts/services/accounts.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
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
          this.getSubscriptions(id, -1);
        }
      });
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 5000 });
  }
  subscription: Subscription = new Subscription();
  private cardID: string = '';

  private getResponce$: Subject<IItemsResponceModel> =
    new BehaviorSubject<IItemsResponceModel>({
      success: false,
      message: '',
      subscriptions: [],
    });

  private filterDate: number = -1;
  setFilterDate(filterDate: number) {
    this.filterDate = filterDate;
    this.getSubscriptions(this.cardID, this.filterDate);
  }

  getSubscriptionList$() {
    this.spinnerService.showSpinner();
    return this.getResponce$.asObservable().pipe(observeOn(asyncScheduler));
  }

  getSubscriptions(id: string, filterDate: number) {
    if (!id) {
      return of<IItemsResponceModel>({
        success: false,
        message: 'No subscriptions found!',
        subscriptions: [],
      });
    }

    this.cardID = id;

    return this.httpClient
      .get<IItemsResponceModel>(
        `${environment.api}subscriptions/${id}?date=${filterDate}`
      )
      .subscribe((result) => {
        this.getResponce$.next(result);
        this.spinnerService.hideSpinner();
      });
  }

  createSubscription(subscription: ISubscription) {
    this.spinnerService.showSpinner();

    return this.httpClient
      .post<IItemsResponceModel>(
        `${environment.api}subscriptions/create/?card=${this.cardID}`,
        subscription
      )
      .subscribe((result) => {
        this.getResponce$.next(result);
        this.openSnackBar(result.message!, 'Done');
        this.spinnerService.hideSpinner();
      });
  }

  updateSubscription(subscription: ISubscription, subscriptionID: string) {
    this.spinnerService.showSpinner();

    return this.httpClient
      .put<IItemsResponceModel>(
        `${environment.api}subscriptions/update/?subscription=${subscriptionID}`,
        subscription
      )
      .subscribe((result) => {
        this.getSubscriptions(this.cardID, this.filterDate);
        this.openSnackBar(result.message!, 'Done');
        this.spinnerService.hideSpinner();
      });
  }

  deleteSubscription(subscriptionID: string) {
    this.spinnerService.showSpinner();

    return this.httpClient
      .delete<IItemsResponceModel>(
        `${environment.api}subscriptions/delete/?card=${this.cardID}&subscription=${subscriptionID}`
      )
      .subscribe((result) => {
        this.getResponce$.next(result);
        this.openSnackBar(result.message!, 'Done');
        this.spinnerService.hideSpinner();
      });
  }
}
