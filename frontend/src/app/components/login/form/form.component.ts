import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IUserResponceModel } from '../../../models/userResponceModel';
import { LoginService } from '../services/login.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  constructor(
    private router: Router,
    private loginService: LoginService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'google',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/google.svg'
      )
    );
  }
  isPasswordVisible: boolean = false;
  subscription: Subscription = new Subscription();
  responce: IUserResponceModel = {
    success: false,
    data: {
      name: '',
      role: '',
      token: '',
    },
  };

  ngOnInit(): void {}

  onSubmit(): void {
    const { email, password } = this.loginForm.value;

    this.subscription = this.loginService
      .login({ email, password })
      .subscribe((result) => {
        if (result.success) {
          this.redirect('dashboard');
        }
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
