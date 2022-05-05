import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() isUserLoggedIn!: boolean;
  @Output() logout: EventEmitter<void> = new EventEmitter<void>();
  isMenuOpened: boolean = false;
  isCurrentUserAdmin: boolean = false;
  lToken!: {
    name: string;
    role: string;
    exp: string;
  };

  constructor(private router: Router) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  public get width(): number {
    return window.innerWidth;
  }

  public currentRoute() {
    return this.router.url;
  }

  public isUserAdmin(): boolean {
    this.isCurrentUserAdmin = this.getUserData('role') === 'ADMIN' && true;
    return this.isCurrentUserAdmin;
  }

  get decodedToken(): { name: string; role: string; exp: string } {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));

      return tokenPayload;
    }
    return { name: '', role: '', exp: '0' };
  }

  getUserName(): string {
    this.lToken = this.decodedToken;

    return this.lToken.name;
  }

  getUserData(data: string): string {
    this.lToken = this.decodedToken;

    if (data === 'role' || data === 'name') {
      return this.lToken[data];
    }

    return 'N/A';
  }

  public toggleMenu(): void {
    this.isMenuOpened = !this.isMenuOpened;
  }

  public redirect(route: string): void {
    this.router.navigate([route]);
  }

  onLogout(): boolean {
    this.logout.emit();
    return false;
  }
}
