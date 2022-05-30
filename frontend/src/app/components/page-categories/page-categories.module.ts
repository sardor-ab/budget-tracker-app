import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageCategoriesComponent } from './page-categories/page-categories.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListModule } from '../list/list.module';

const routes: Routes = [
  {
    path: '',
    component: PageCategoriesComponent,
  },
];

@NgModule({
  declarations: [PageCategoriesComponent],
  imports: [
    CommonModule,
    SharedModule,
    ListModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule, PageCategoriesComponent],
})
export class PageCategoriesModule {}
