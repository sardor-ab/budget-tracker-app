import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IUserResponceModel } from '../../../models/userResponceModel';
import { LoginService } from '../services/login.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ErrorService } from 'src/app/config/services/error.service';
import { SpinnerService } from '../../spinner/services/spinner.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  constructor(
    private router: Router,
    private loginService: LoginService,
    private errorService: ErrorService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private spinnerService: SpinnerService
  ) {
    this.matIconRegistry.addSvgIcon(
      'google',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/google.svg'
      )
    );
  }
  isPasswordVisible: boolean = false;
  invalidCredentials: boolean = false;
  errorText: string = '';
  subscription: Subscription = new Subscription();
  responce: IUserResponceModel = {
    success: false,
    data: {
      name: '',
      role: '',
      token: '',
    },
  };

  ngOnInit(): void {
    this.invalidCredentials = false;
    this.errorService.hideErrorText();

    this.subscription = this.errorService
      .getisInvalidCredentialsVisibleState$()
      .subscribe((data) => {
        if (data) {
          this.errorText = this.errorService.getErrorText();
          this.invalidCredentials = true;
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit(): void {
    const { email, password } = this.loginForm.value;

    this.spinnerService.showSpinner();

    this.subscription = this.loginService
      .login({ email, password })
      .subscribe((result) => {
        if (result.success) {
          this.redirect('dashboard');
          this.errorService.hideErrorText();
        }
        this.spinnerService.hideSpinner();
      });
  }

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]),
    password: new FormControl('', [Validators.required]),
  });

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  redirect(path: string) {
    return this.router.navigate([path]);
  }
}
