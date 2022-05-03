import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from '../shared/shared.module';
import { LoginModule } from './login/login.module';
import { RegistrationModule } from './registration/registration.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../config/interceptors/auth.interceptor';
import { DialogComponent } from './dialog/dialog.component';

@NgModule({
  declarations: [HeaderComponent, DashboardComponent, SpinnerComponent, DialogComponent],
  imports: [CommonModule, SharedModule, LoginModule, RegistrationModule],
  exports: [HeaderComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class ComponentsModule {}
