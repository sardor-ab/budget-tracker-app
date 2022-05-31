import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { SidenavService } from './services/sidenav.service';
import { AccountsService } from '../accounts/services/accounts.service';
import { TransactionService } from '../transactions/service/transaction.service';
import { CategoryService } from '../categories/service/category.service';
import { ICategory } from 'src/app/models/ResponceModels';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  constructor(
    private sidenavService: SidenavService,
    private categoryService: CategoryService,
    private accountsService: AccountsService,
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

  isCategoryEdit: boolean = false;
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
    category?: {
      _id: string;
      name: string;
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

  categoryForm: FormGroup = new FormGroup({
    _id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
  });

  types: Type[] = [
    { value: 'income', viewValue: 'Income' },
    { value: 'expense', viewValue: 'Expense' },
  ];

  get categoryTitle() {
    return this.categoryForm.get('name');
  }

  get categoryType() {
    return this.categoryForm.get('type');
  }

  ngOnInit(): void {
    this.subscription = this.sidenavService
      .getSidenavData$()
      .subscribe((state) => {
        this.responce = state;

        switch (this.responce?.title) {
          case 'Account':
            this.isAccount = true;
            this.isAccountEdit = false;
            this.isTransaction = false;
            this.isTransactionEdit = false;
            this.isCategoryEdit = false;
            break;
          case 'Transaction':
            this.isAccount = false;
            this.isAccountEdit = false;
            this.isTransaction = true;
            this.isTransactionEdit = false;
            this.isCategoryEdit = false;
            break;
          case 'Category':
            this.isCategoryEdit = true;
            this.isAccount = false;
            this.isAccountEdit = false;
            this.isTransaction = false;
            this.isTransactionEdit = false;

            this.categoryTitle?.setValue(this.responce?.category?.name);
            this.categoryType?.setValue(this.responce?.category?.type);
            this.categoryForm
              ?.get('_id')
              ?.setValue(this.responce?.category?._id);

            break;
        }
      });

    this.subscription = this.categoryService
      .getCategoryList$()
      .subscribe((result) => {
        this.categoriesList = result.categories;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setTransactionCategoryList(type: string) {
    this.categoryService.getCategories(type);
    if (type != this.currentTransactionType) {
      this.preSelected = [];
      this.transactionCategories?.setValue(this.preSelected);
    }
  }

  openEditPanel(title: string) {
    this.categoriesList = [];
    if (title === 'Account') {
      this.isAccount = false;
      this.isAccountEdit = true;

      this.title?.setValue(this.responce.account?.title);
      this.description?.setValue(this.responce.account?.description);
    } else {
      this.isTransaction = false;
      this.isTransactionEdit = true;

      this.transactionTitle?.setValue(this.responce.transaction?.title);
      this.transactionDescription?.setValue(
        this.responce.transaction?.description
      );
      this.transactionType?.setValue(this.responce.transaction?.type);

      this.setTransactionCategoryList(this.transactionType?.value);

      this.responce.transaction?.categories.map((category) => {
        this.preSelected.push(category);
      });

      this.transactionCategories?.setValue(this.preSelected);

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
    this.isAccount = false;
    this.isTransaction = false;
    this.isAccountEdit = false;
    this.isCategoryEdit = false;
    this.isTransactionEdit = false;
    this.sidenavService.hideSideNav();
  }

  onEditSave() {
    switch (this.responce?.title) {
      case 'Account':
        this.accountForm
          .get('currency')
          ?.setValue(this.responce.account?.currency);
        this.accountForm
          .get('balance')
          ?.setValue(this.responce.account?.balance);
        this.accountForm.get('type')?.setValue(this.responce.account?.type);

        this.accountsService.editAccount(
          this.accountForm.value,
          this.responce.account?._id!
        );
        break;
      case 'Transaction':
        this.transactionService.editTransaction(
          this.transactionForm.value,
          this.responce.transaction?._id!
        );
        break;
      case 'Category':
        this.categoryService.updateCategory(this.categoryForm.value);
        break;
    }

    this.onClose();
  }

  isFormFilled(): boolean {
    switch (this.responce?.title) {
      case 'Transaction':
        return this.transactionForm.valid;
      case 'Account':
        return this.accountForm.valid;
      case 'Category':
        return this.categoryForm.valid;
    }
    return false;
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
    switch (title) {
      case 'Account':
        this.accountsService.deleteAccount(this.responce.account?._id!);
        break;
      case 'Transaction':
        this.transactionService.deleteTransaction(
          this.responce.transaction?.card!,
          this.responce.transaction?._id!
        );
        break;
    }

    this.onClose();
  }
}
interface Type {
  value: string;
  viewValue: string;
}
