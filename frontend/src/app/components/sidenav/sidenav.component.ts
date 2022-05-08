import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AccountsService } from '../accounts/services/accounts.service';
import { SidenavService } from './services/sidenav.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  constructor(
    private sidenavService: SidenavService,
    private accountsService: AccountsService,
    private _snackBar: MatSnackBar
  ) {}
  subscription: Subscription = new Subscription();
  isTransaction: boolean = false;
  isTransactionEdit: boolean = false;
  isAccount: boolean = false;
  isAccountEdit: boolean = false;
  responce!: {
    title: string;
    account?: {
      balance: number;
      currency: string;
      title: string;
      type: string;
      _id: string;
      description: string;
    };
  };

  accountForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    currency: new FormControl(''),
    balance: new FormControl(''),
    type: new FormControl(''),
  });

  get title() {
    return this.accountForm.get('title');
  }

  get description() {
    return this.accountForm.get('description');
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 5000 });
  }

  ngOnInit(): void {
    this.subscription = this.sidenavService
      .getSidenavData$()
      .subscribe((state) => {
        this.responce = state;

        if (this.responce?.title === 'Account') {
          this.isAccount = true;
          this.isAccountEdit = false;
          this.isTransaction = false;
          this.isTransactionEdit = false;
        } else {
          this.isTransaction = true;
          this.isTransactionEdit = false;
          this.isAccountEdit = false;
          this.isAccount = false;
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openEditPanel(title: string) {
    if (title === 'Account') {
      this.isAccountEdit = true;
      this.isAccount = false;

      this.title?.setValue(this.responce.account?.title);
      this.description?.setValue(this.responce.account?.description);
    }
  }

  onClose() {
    this.isTransaction = false;
    this.isTransactionEdit = false;
    this.isAccount = false;
    this.isAccountEdit = false;
    this.sidenavService.hideSideNav();
  }

  onEditSave() {
    this.accountForm.get('currency')?.setValue(this.responce.account?.currency);
    this.accountForm.get('balance')?.setValue(this.responce.account?.balance);
    this.accountForm.get('type')?.setValue(this.responce.account?.type);

    this.subscription = this.accountsService
      .editAccount(this.accountForm.value, this.responce.account?._id!)
      .subscribe((result) => {
        if (result.success) {
          this.openSnackBar('Account changed successfully!', 'Done');
          this.accountsService.requestUpdate();
        }
      });
    this.onClose();
  }

  onEditClose() {
    if (this.isTransactionEdit) {
      this.isTransactionEdit = false;
      this.isTransaction = true;
    } else if (this.isAccountEdit) {
      this.isAccountEdit = false;
      this.isAccount = true;
    }
  }

  deleteAccount(title: string) {
    if (title === 'Account') {
      this.onClose();
      this.accountsService
        .deleteAccount(this.responce.account?._id!)
        .subscribe((result) => {
          if (result.success) {
            this.openSnackBar('Account successfully deleted!', 'Done');
            this.accountsService.requestUpdate();
          }
        });
    }
  }
}
