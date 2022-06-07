import { Component, Input, OnInit } from '@angular/core';
import { ISubscription } from 'src/app/models/ResponceModels';
import { SidenavService } from '../sidenav/services/sidenav.service';
import { SubscriptionService } from './service/subscription.service';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss'],
})
export class SubscriptionsComponent implements OnInit {
  constructor(
    private subscriptionService: SubscriptionService,
    private sidenavService: SidenavService
  ) {}

  @Input() subscriptions!: ISubscription[];
  @Input() noItems!: boolean;

  ngOnInit(): void {}

  updateSubscription(subscription: ISubscription): void {
    const data = {
      title: 'Subscription',
      subscription: subscription,
    };

    this.sidenavService.setSidenavData$(data);
    this.sidenavService.showSideNav();
  }
}
