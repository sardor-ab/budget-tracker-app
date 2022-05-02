import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from '../shared/shared.module';
import { LoginModule } from './login/login.module';
import { RegistrationModule } from './registration/registration.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [HeaderComponent, DashboardComponent],
  imports: [CommonModule, SharedModule, LoginModule, RegistrationModule],
  exports: [HeaderComponent],
})
export class ComponentsModule {}
