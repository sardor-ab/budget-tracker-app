import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ICategory } from 'src/app/models/ResponceModels';
import { CategoryService } from '../service/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  constructor(private categoryService: CategoryService) {}
  subscription: Subscription = new Subscription();

  @Input() categories!: ICategory[];
  @Input() noItems!: boolean;

  ngOnInit(): void {
    this.subscription = this.categoryService
      .shouldUpdate$()
      .subscribe((state) => {});
  }
}
