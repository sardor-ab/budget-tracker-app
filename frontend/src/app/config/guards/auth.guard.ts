import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/components/login/services/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (
      route.routeConfig?.path === 'login' ||
      route.routeConfig?.path === 'register'
    ) {
      if (this.loginService.isUserLoggedIn()) {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    }

    return (
      this.loginService.isUserLoggedIn() || this.router.createUrlTree(['login'])
    );
  }
}
