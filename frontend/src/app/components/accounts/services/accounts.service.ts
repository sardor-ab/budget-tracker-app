import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
HttpClient;
import { AccountsResponce } from '../models/accountsResponceModel';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  constructor(private httpClient: HttpClient) {}

  getUserAccounts() {
    return this.httpClient.get<AccountsResponce>(`${environment.api}accounts/`);
  }
}
