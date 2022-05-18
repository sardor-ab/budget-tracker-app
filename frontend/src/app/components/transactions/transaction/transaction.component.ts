import { Component, Input, OnInit } from '@angular/core';
import { ITransaction } from '../transactions.component';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {
  @Input() transactions!: ITransaction;
  constructor() {}

  ngOnInit(): void {}
}
