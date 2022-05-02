import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form/form.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [FormComponent],
  imports: [CommonModule, SharedModule],
  exports: [FormComponent],
})
export class LoginModule {}
