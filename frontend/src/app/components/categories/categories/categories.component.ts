import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ICategory } from 'src/app/models/ResponceModels';
import { DialogService } from '../../dialog/services/dialog.service';
import { SidenavService } from '../../sidenav/services/sidenav.service';
import { CategoryService } from '../service/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  constructor(
    private categoryService: CategoryService,
    private sidenavService: SidenavService,
    private dialogService: DialogService
  ) {}
  subscription: Subscription = new Subscription();

  @Input() categories!: ICategory[];
  @Input() noItems!: boolean;

  ngOnInit(): void {
    this.categoryService.getCategories('all');
    this.subscription = this.categoryService
      .getCategoryList$()
      .subscribe((result) => {
        this.categories = result.categories;
      });
  }

  createCategory() {
    this.dialogService.showDialog('Information for a new category', 'Category');
  }

  editCategory(category: ICategory) {
    const data = {
      title: 'Category',
      category: category,
    };
    this.sidenavService.setSidenavData$(data);
    this.sidenavService.showSideNav();
  }

  deleteCategory(category: ICategory) {
    // this.dialogService.showDialog(
    //   `Are you sure you want to delete ${category.name} category?`,
    //   'Category'
    // );
    this.categoryService.deleteCategory(category);
  }
}
