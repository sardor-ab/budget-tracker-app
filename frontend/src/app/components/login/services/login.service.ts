import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs';
import { IUserResponceModel } from '../../../models/ResponceModels';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private httpClient: HttpClient) {}

  login(credentials: { email: string; password: string }) {
    return this.httpClient
      .post<IUserResponceModel>(`${environment.api}users/login`, credentials)
      .pipe(tap((res) => this.setSession(res)));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
  }

  isUserLoggedIn(): boolean {
    return new Date().getTime() < Number(localStorage.getItem('expiresAt'));
  }

  private setSession(loginResult: any): void {
    localStorage.setItem('token', loginResult.data.token);
    let tokenTime = JSON.parse(atob(loginResult.data.token.split('.')[1]));
    tokenTime = tokenTime.exp * 1000;
    localStorage.setItem('expiresAt', tokenTime.toString());
  }
}
