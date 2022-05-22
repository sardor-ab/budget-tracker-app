import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, asyncScheduler, Subject } from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private httpClient: HttpClient) {}

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

  getCategories(type: string) {
    return this.httpClient.get<ICategoryResult>(
      `${environment.api}categories/?type=${type}`
    );
  }
}

export interface ICategoryResult {
  success: boolean;
  data: ICategory[];
}

export interface ICategory {
  type: string;
  name: string;
}
