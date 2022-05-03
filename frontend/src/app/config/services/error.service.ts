import { Injectable } from '@angular/core';
import { BehaviorSubject, asyncScheduler, Subject } from 'rxjs';
import { observeOn } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor() {}
  private isInvalidCredentialsVisible$: Subject<boolean> =
    new BehaviorSubject<boolean>(false);
  private text = new BehaviorSubject<string>('');
  public showError = this.text.asObservable();

  provideError(errorText: string) {
    this.text.next(errorText);
  }

  getisInvalidCredentialsVisibleState$() {
    return this.isInvalidCredentialsVisible$
      .asObservable()
      .pipe(observeOn(asyncScheduler));
  }

  getErrorText() {
    return this.text.getValue();
  }

  showErrorText() {
    this.isInvalidCredentialsVisible$.next(true);
  }

  hideErrorText() {
    this.isInvalidCredentialsVisible$.next(false);
  }
}
