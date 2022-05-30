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
  private categoryList$: Subject<ICategory[]> = new BehaviorSubject<
    ICategory[]
  >([]);
  private isCategoryListFilled$: Subject<boolean> =
    new BehaviorSubject<boolean>(false);

  shouldUpdate$() {
    return this.isUpdated$.asObservable().pipe(observeOn(asyncScheduler));
  }

  setUpdateState(state: boolean) {
    this.isUpdated$.next(state);
  }

  categoryListFilled$(state: boolean) {
    this.isCategoryListFilled$.next(state);
  }

  getCategoryList$() {
    return this.categoryList$.asObservable().pipe(observeOn(asyncScheduler));
  }

  getCategories(type: string) {
    return this.httpClient
      .get<ICategoryResult>(`${environment.api}categories/?type=${type}`)
      .subscribe((result) => {
        this.categoryList$.next(result.categories);
      });
  }
}

export interface ICategoryResult {
  success: boolean;
  categories: ICategory[];
}

export interface ICategory {
  type: string;
  name: string;
}
