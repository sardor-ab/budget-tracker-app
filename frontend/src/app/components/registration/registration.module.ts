import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterFormComponent } from './register-form/register-form.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [RegisterFormComponent],
  imports: [CommonModule, SharedModule],
  exports: [RegisterFormComponent],
})
export class RegistrationModule {}
