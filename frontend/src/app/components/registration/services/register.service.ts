import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IUserResponceModel } from 'src/app/models/userResponceModel';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private httpClient: HttpClient) {}

  register(data: { name: string; email: string; password: string }) {
    return this.httpClient
      .post<IUserResponceModel>(`${environment.api}users/register`, data)
      .pipe(tap((res) => this.setSession(res)));
  }

  private setSession(registerResult: any): void {
    localStorage.setItem('token', registerResult.data.token);
    let tokenTime = JSON.parse(atob(registerResult.data.token.split('.')[1]));
    tokenTime = tokenTime.exp * 1000;
    localStorage.setItem('expiresAt', tokenTime.toString());
  }
}
