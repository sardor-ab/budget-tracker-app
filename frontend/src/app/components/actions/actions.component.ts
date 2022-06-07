import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountsService } from '../accounts/services/accounts.service';
import { SpinnerService } from '../spinner/services/spinner.service';
import { ActionsService } from './services/actions.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent implements OnInit {
  constructor(
    private actionsService: ActionsService,
    private accountsService: AccountsService,
    private spinnerService: SpinnerService
  ) {}
  noAccounts: boolean = true;
  subscription: Subscription = new Subscription();
  @Input() type!: string;

  ngOnInit(): void {
    this.updateAccessState();
    this.subscription = this.accountsService
      .shouldUpdate$()
      .subscribe((state) => {
        if (state) {
          this.updateAccessState();
        }
      });
  }

  updateAccessState() {
    this.subscription = this.actionsService.noAccounts().subscribe((result) => {
      if (result.success) {
        this.noAccounts = result.data?.length === 0;
      } else {
        this.noAccounts = true;
      }
      this.spinnerService.hideSpinner();
    });
  }

  onAddAction = (type: string): void => {
    this.actionsService.addingNew(type);
  };

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
