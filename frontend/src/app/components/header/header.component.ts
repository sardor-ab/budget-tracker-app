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
  isCurrentUserAdmin: boolean = true;

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
    return this.isCurrentUserAdmin;
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
