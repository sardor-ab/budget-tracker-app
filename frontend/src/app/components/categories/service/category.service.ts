import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { BehaviorSubject, asyncScheduler, Subject } from 'rxjs';
import { catchError, observeOn } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private httpClient: HttpClient, private _snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 5000 });
  }

  private isUpdated$: Subject<boolean> = new BehaviorSubject<boolean>(false);
  private categoryList$: Subject<ICategoryResult> =
    new BehaviorSubject<ICategoryResult>({
      success: false,
      categories: [],
      message: '',
    });
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

  private filterType: string = 'all';
  setFilterType(filterType: string) {
    this.filterType = filterType;
    this.getCategories(this.filterType);
  }

  getCategories(type: string) {
    return this.httpClient
      .get<ICategoryResult>(`${environment.api}categories/?type=${type}`)
      .subscribe((result) => {
        this.categoryList$.next(result);
      });
  }

  createCategory(category: ICategory) {
    return this.httpClient
      .post<ICategoryResult>(`${environment.api}categories/`, category)
      .pipe(
        catchError((error) => {
          return of({
            success: false,
            categories: error.error.categories,
            message: error.error.message,
          });
        })
      )
      .subscribe((result) => {
        if (result.success) {
          this.categoryList$.next(result);
        }
        this.openSnackBar(result.message, 'OK');
      });
  }

  updateCategory(category: ICategory) {
    return this.httpClient
      .put<ICategoryResult>(
        `${environment.api}categories/?categoryID=${category._id}`,
        category
      )
      .pipe(
        catchError((error) => {
          return of({
            success: false,
            categories: error.error.categories,
            message: error.error.message,
          });
        })
      )
      .subscribe((result) => {
        if (result.success) {
          this.categoryList$.next(result);
        }
        this.openSnackBar(result.message, 'OK');
      });
  }

  deleteCategory(category: ICategory) {
    return this.httpClient
      .delete<ICategoryResult>(
        `${environment.api}categories/?categoryID=${category._id}`
      )
      .pipe(
        catchError((error) => {
          return of({
            success: false,
            categories: error.error.categories,
            message: error.error.message,
          });
        })
      )
      .subscribe((result) => {
        if (result.success) {
          this.categoryList$.next(result);
        }
        this.openSnackBar(result.message, 'OK');
      });
  }
}

export interface ICategoryResult {
  success: boolean;
  categories: ICategory[];
  message?: string;
}

export interface ICategory {
  type: string;
  name: string;
  _id: string;
}
