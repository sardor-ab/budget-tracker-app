import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  CategoryService,
  ICategory,
} from 'src/app/config/services/category/category.service';
import { AccountsService } from '../accounts/services/accounts.service';
import { TransactionService } from '../transactions/services/transaction.service';
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
    private categoryService: CategoryService,
    private transactionService: TransactionService
  ) {
    const currentYear = new Date();
    this.maxDate = new Date(currentYear);
  }
  maxDate: Date;
  subscription: Subscription = new Subscription();

  currentTransactionType: string = '';
  categoriesList: ICategory[] = [];
  preSelected: any[] = [];

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
    transaction?: {
      _id: string;
      user: string;
      card: string;
      title: string;
      categories: {
        _id: string;
        name: string;
        // type: string;
      }[];
      amount: number;
      date: Date;
      description: string;
      attachment: string;
      payee: string;
      type: string;
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

  transactionForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    categories: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    payee: new FormControl('', [Validators.required]),
    description: new FormControl(''),

    // card: new FormControl(this.responce.transaction?.card!),
    // attachment: new FormControl(''),
  });

  get transactionTitle() {
    return this.transactionForm.get('title');
  }

  get transactionType() {
    return this.transactionForm.get('type');
  }

  get transactionCategories() {
    return this.transactionForm.get('categories');
  }

  get transactionDescription() {
    return this.transactionForm.get('description');
  }

  get transactionAmount() {
    return this.transactionForm.get('amount');
  }

  get transactionDate() {
    return this.transactionForm.get('date');
  }

  get transactionPayee() {
    return this.transactionForm.get('payee');
  }

  get transactionAttachment() {
    return this.transactionForm.get('attachment');
  }

  selectTransactionType(type: string) {
    this.setTransactionCategoryList(type);
    this.currentTransactionType = type;
    this.transactionType?.setValue(type);
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

  setTransactionCategoryList(type: string) {
    if (type != this.currentTransactionType) {
      this.preSelected = [];
    }
    this.categoryService.getCategories(type).subscribe((cats) => {
      if (cats.success) {
        this.categoriesList = cats.data;
        this.transactionCategories?.setValue(this.preSelected);
      }
    });
  }

  openEditPanel(title: string) {
    this.categoriesList = [];
    if (title === 'Account') {
      this.isAccountEdit = true;
      this.isAccount = false;

      this.title?.setValue(this.responce.account?.title);
      this.description?.setValue(this.responce.account?.description);
    } else {
      this.isTransactionEdit = true;
      this.isTransaction = false;

      this.transactionTitle?.setValue(this.responce.transaction?.title);
      this.transactionDescription?.setValue(
        this.responce.transaction?.description
      );
      this.transactionType?.setValue(this.responce.transaction?.type);

      this.currentTransactionType = this.transactionType?.value;

      this.responce.transaction?.categories.map((category) => {
        this.preSelected.push(category);
      });

      this.setTransactionCategoryList(this.currentTransactionType);

      this.transactionAmount?.setValue(this.responce.transaction?.amount);
      this.transactionDate?.setValue(this.responce.transaction?.date);
      this.transactionPayee?.setValue(this.responce.transaction?.payee);
      this.transactionAttachment?.setValue(
        this.responce.transaction?.attachment
      );

      this.currentTransactionType = this.transactionType?.value;
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
    if (this.responce?.title === 'Account') {
      this.accountForm
        .get('currency')
        ?.setValue(this.responce.account?.currency);
      this.accountForm.get('balance')?.setValue(this.responce.account?.balance);
      this.accountForm.get('type')?.setValue(this.responce.account?.type);

      this.accountsService.editAccount(
        this.accountForm.value,
        this.responce.account?._id!
      );
    } else {
      this.transactionService.editTransaction(
        this.transactionForm.value,
        this.responce.transaction?.card!,
        this.responce.transaction?._id!
      );
    }

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

  deleteAction(title: string) {
    if (title === 'Account') {
      this.accountsService.deleteAccount(this.responce.account?._id!);
    } else if (title === 'Transaction') {
      this.transactionService.deleteTransaction(
        this.responce.transaction?.card!,
        this.responce.transaction?._id!
      );
    }
    this.onClose();
  }
}
