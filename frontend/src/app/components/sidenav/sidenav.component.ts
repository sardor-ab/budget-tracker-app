import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SidenavService } from './services/sidenav.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  constructor(private sidenavService: SidenavService) {}
  subscription: Subscription = new Subscription();
  responce!: {
    title: string;
    accountData?: {
      balance: number;
      currency: string;
      title: string;
      type: string;
      user: string;
      _id: string;
    };
  };

  ngOnInit(): void {
    this.subscription = this.sidenavService
      .getSidenavData$()
      .subscribe((state) => {
        this.responce = state;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
