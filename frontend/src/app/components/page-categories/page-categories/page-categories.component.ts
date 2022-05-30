import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-categories',
  templateUrl: './page-categories.component.html',
  styleUrls: ['./page-categories.component.scss'],
})
export class PageCategoriesComponent implements OnInit {
  @Input() categories: any[] = [];
  @Input() noItems!: boolean;

  constructor() {}

  ngOnInit(): void {}
}
