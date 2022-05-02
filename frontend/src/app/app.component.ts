import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './components/login/services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private loginService: LoginService, private router: Router) {}
  title = 'frontend';

  logout() {
    this.loginService.logout();
    this.router.navigateByUrl('/login');
  }

  get isUserLoggedIn(): boolean {
    return this.loginService.isUserLoggedIn();
  }
}
