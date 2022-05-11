import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActionsService } from './services/actions.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent implements OnInit {
  constructor(private actionsService: ActionsService) {}
  noAccounts: boolean = true;
  subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.subscription = this.actionsService.noAccounts().subscribe((result) => {
      if (result) {
        console.log(result);
        this.noAccounts = false;
      }
    });
  }

  onAddAccount = (): void => {
    this.actionsService.addingNew('Account');
  };

  onAddTransaction = (): void => {
    this.actionsService.addingNew('Transaction');
  };
}
