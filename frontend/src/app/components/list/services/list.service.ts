import { Injectable } from '@angular/core';
import { BehaviorSubject, asyncScheduler, Subject } from 'rxjs';
import { observeOn } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  constructor() {}

  private currentListType$: Subject<string> = new BehaviorSubject<string>(
    'transactions'
  );

  getCurrentListType$() {
    return this.currentListType$.asObservable().pipe(observeOn(asyncScheduler));
  }

  updateType(type: string): void {
    this.currentListType$.next(type);
  }
}
