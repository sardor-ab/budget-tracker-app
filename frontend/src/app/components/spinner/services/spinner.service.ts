import { Injectable } from '@angular/core';
import { BehaviorSubject, asyncScheduler, Subject } from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  constructor() {}
  private isSpinnerVisible$: Subject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  getSpinnerState$() {
    return this.isSpinnerVisible$
      .asObservable()
      .pipe(observeOn(asyncScheduler));
  }

  showSpinner() {
    this.isSpinnerVisible$.next(true);
  }

  hideSpinner() {
    this.isSpinnerVisible$.next(false);
  }
}
