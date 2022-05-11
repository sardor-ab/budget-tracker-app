import { Component, OnInit } from '@angular/core';
import { ActionsService } from './services/actions.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent implements OnInit {
  constructor(private actionsService: ActionsService) {}
  noAccounts: boolean = true;

  ngOnInit(): void {
    this.noAccounts = this.actionsService.noAccounts();
  }

  onAddAccount = (): void => {
    this.actionsService.addingNew('Account');
  };

  onAddTransaction = (): void => {
    this.actionsService.addingNew('Transaction');
  };
}
