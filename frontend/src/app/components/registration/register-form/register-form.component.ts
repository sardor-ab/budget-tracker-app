import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RegisterService } from '../services/register.service';
import { Router } from '@angular/router';
import { ErrorService } from 'src/app/config/services/error.service';
import { DialogService } from '../../dialog/services/dialog.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent implements OnInit {
  constructor(
    private router: Router,
    private matIconRegistry: MatIconRegistry,
    private errorService: ErrorService,
    private domSanitizer: DomSanitizer,
    private registerService: RegisterService,
    private dialogService: DialogService
  ) {
    this.matIconRegistry.addSvgIcon(
      'google',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/google.svg'
      )
    );
  }
  isPasswordVisible: boolean = false;
  errorText: string = '';
  isEmailUsed: boolean = false;
  subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.subscription = this.errorService
      .getisInvalidCredentialsVisibleState$()
      .subscribe((state) => {
        if (state) {
          this.errorText = this.errorService.getErrorText();
          this.dialogService.provideMessage(this.errorText);
          this.dialogService.showDialog('Error', 'Notification');
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getErrorMessage() {
    return this.email?.errors?.['required']
      ? (this.errorText = 'Email is required')
      : this.email?.errors?.['pattern']
      ? (this.errorText = 'Not a valid email')
      : this.isEmailUsed
      ? this.errorText
      : '';
  }

  passwordMatchingValidatior: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    return password &&
      confirmPassword &&
      password.value === confirmPassword.value
      ? null
      : { notmatched: true };
  };

  registrationForm: FormGroup = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
      ]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordMatchingValidatior }
  );

  get email() {
    return this.registrationForm.get('email');
  }

  get password() {
    return this.registrationForm.get('password');
  }

  get confirmationPassword() {
    return this.registrationForm.get('confirmPassword');
  }

  get name() {
    return this.registrationForm.get('name');
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  redirect(path: string) {
    return this.router.navigate([path]);
  }

  onSubmit(): void {
    const { email, password, name } = this.registrationForm.value;

    this.subscription = this.registerService
      .register({ email, password, name })
      .subscribe((res) => {
        if (res.success) {
          this.redirect('dashboard');
          this.isEmailUsed = false;
        }
      });
  }
}
