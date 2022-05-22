import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  constructor(private httpClient: HttpClient) {}

  getCurrencies() {
    return this.httpClient.get<IResultCurrencies>(
      `${environment.api}currencies/`
    );
  }
}

export interface IResultCurrencies {
  success: boolean;
  data: ICurrency[];
}

export interface ICurrency {
  currency: string;
  abbreviation: string;
  symbol: string;
}
