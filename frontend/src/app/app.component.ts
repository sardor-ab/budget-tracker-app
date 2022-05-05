import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from './components/login/services/login.service';
import { SidenavService } from './components/sidenav/services/sidenav.service';
import { SpinnerService } from './components/spinner/services/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private spinnerService: SpinnerService,
    private sidenavService: SidenavService
  ) {}
  title = 'frontend';
  isSpinnerVisible: boolean = false;
  isSidenavVisible: boolean = false;
  subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.subscription = this.spinnerService
      .getSpinnerState$()
      .subscribe((result) => {
        this.isSpinnerVisible = result;
      });

    this.subscription = this.sidenavService
      .getSideNavState$()
      .subscribe((state) => {
        this.isSidenavVisible = state;
      });
  }

  logout() {
    this.loginService.logout();
    this.router.navigateByUrl('/login');
  }

  onDestroy(): void {
    this.subscription.unsubscribe();
  }

  get isUserLoggedIn(): boolean {
    return this.loginService.isUserLoggedIn();
  }

  closeSideNav() {
    this.sidenavService.hideSideNav();
  }
}
