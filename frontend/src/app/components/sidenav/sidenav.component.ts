import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  });

  get title() {
    return this.accountForm.get('title');
  }

  get description() {
    return this.accountForm.get('description');
  }

  ngOnInit(): void {
    this.subscription = this.sidenavService
      .getSidenavData$()
      .subscribe((state) => {
        this.responce = state;

        console.log(state);

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
    //some actions to db
    console.log('Data edited');
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
}
