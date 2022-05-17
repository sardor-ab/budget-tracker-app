import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  @Input() type!: string;
  selectedFilterType: string = 'all';
  selectedFilterDate: string = 'latest';

  search_request(request: string) {
    console.log(request);
  }

  types = [
    {
      label: 'income',
      icon: 'arrow_upward',
      method: () => this.sortByType('income'),
    },
    {
      label: 'expence',
      icon: 'arrow_downward',
      method: () => this.sortByType('expence'),
    },
  ];

  dates = [
    {
      label: 'latest',
      icon: 'arrow_downward',
      method: () => this.sortByDate('latest'),
    },
    {
      label: 'oldest',
      icon: 'arrow_upward',
      method: () => this.sortByDate('oldest'),
    },
  ];

  sortByDate(filter: string) {
    this.selectedFilterDate = filter;
  }

  sortByType(filter: string) {
    if (filter !== this.selectedFilterType) {
      this.selectedFilterType = filter;
    } else {
      this.selectedFilterType = 'all';
    }
  }

  constructor() {}

  ngOnInit(): void {}
}
