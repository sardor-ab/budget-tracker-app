import { Injectable } from '@angular/core';
import { asyncScheduler, BehaviorSubject, Subject } from 'rxjs';
import { observeOn } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  constructor() {}
  private isVisible$: Subject<boolean> = new BehaviorSubject<boolean>(false);
  private data$: Subject<AllowedData> = new BehaviorSubject<AllowedData>({
    title: '',
  });

  getSideNavState$() {
    return this.isVisible$.asObservable().pipe(observeOn(asyncScheduler));
  }

  getSidenavData$() {
    return this.data$.asObservable().pipe(observeOn(asyncScheduler));
  }

  setSidenavData$(sharedData: {
    title: string;
    account: {
      title: string;
      balance: number;
      currency: string;
      description: string;
      type: string;
      _id: string;
    };
  }) {
    this.data$.next(sharedData);
  }

  showSideNav() {
    this.isVisible$.next(true);
  }

  hideSideNav() {
    this.isVisible$.next(false);
  }
}

export interface AllowedData {
  title: string;
  account?: {
    title: string;
    balance: number;
    currency: string;
    description: string;
    type: string;
    _id: string;
  };
}
