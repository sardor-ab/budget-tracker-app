import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { LoginService } from 'src/app/components/login/services/login.service';
import { Router } from '@angular/router';
import { ErrorService } from '../services/error.service';
import { SpinnerService } from 'src/app/components/spinner/services/spinner.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private errorService: ErrorService,
    private spinnerService: SpinnerService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');

    request = request.clone({
      setHeaders: {
        Authorization: String(token),
      },
    });

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorService.provideError(error.error?.message);

        if (!error.url?.includes('categories')) {
          this.errorService.showErrorText();
          this.loginService.logout();
          this.router.navigate(['login']);
        }

        this.spinnerService.hideSpinner();
        return throwError(() => error);
      })
    );
  }
}
