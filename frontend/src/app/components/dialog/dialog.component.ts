import { Subscription } from 'rxjs';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from './services/dialog.service';
import { CurrencyService } from 'src/app/config/services/currency/currency.service';
import { CategoryService } from '../categories/service/category.service';
import { TransactionService } from '../transactions/service/transaction.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; message: string; type: string },
    private dialogService: DialogService,
    private categoryService: CategoryService,
    private transactionService: TransactionService,
    private currencyService: CurrencyService
  ) {
    const currentYear = new Date();
    this.maxDate = new Date(currentYear);
    this.subscription = this.dialogService
      .setCurrentCurrency()
      .subscribe((currency: string) => {
        this.currentCurrency = currency;
      });
  }
  maxDate: Date;

  subscription: Subscription = new Subscription();

  title: string = '';
  message: string = '';
  selectedCategory: string = '';

  notification: boolean = false;
  creatingAccount: boolean = false;
  creatingTransaction: boolean = false;
  creatingCategory: boolean = false;

  typeSelected: boolean = false;

  currentCurrency: string = '';

  availableCurrencies!: Currency[];
  selectedValue: string = '';

  types: Type[] = [
    { value: 'income', viewValue: 'Income' },
    { value: 'expense', viewValue: 'Expense' },
  ];

  categories!: Category[];

  transactionForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    categories: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    amount: new FormControl('', [Validators.required, Validators.min(0)]),
    payee: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    description: new FormControl(''),
  });

  get transactionTitle() {
    return this.transactionForm.get('title');
  }

  get transactionType() {
    return this.transactionForm.get('type');
  }

  onTypeChange(value: string) {
    switch (this.data?.type) {
      case 'Account':
        break;
      case 'Transaction':
        this.categoryService.getCategories(value);
        this.transactionCategories?.enable();
        break;
      case 'Category':
        this.categoryType?.setValue(value);
        break;
    }
  }

  get transactionCategories() {
    return this.transactionForm.get('categories');
  }

  get transactionDate() {
    return this.transactionForm.get('date');
  }

  get transactionAmount() {
    return this.transactionForm.get('amount');
  }

  get transactionPayee() {
    return this.transactionForm.get('payee');
  }

  accountForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    currency: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    // type: new FormControl('', [Validators.required]),
  });

  get accountTitle() {
    return this.accountForm.get('title');
  }

  get accountCurrency() {
    return this.accountForm.get('currency');
  }

  get accountDescription() {
    return this.accountForm.get('description');
  }

  fillCurrencies() {
    this.subscription = this.currencyService
      .getCurrencies()
      .subscribe((result) => {
        if (result.success) {
          this.availableCurrencies = result.data;
        }
      });
  }

  // get accountType() {
  //   return this.accountForm.get('type');
  // }

  categoryForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
  });

  get categoryTitle() {
    return this.categoryForm.get('name');
  }

  get categoryType() {
    return this.categoryForm.get('type');
  }

  isFormFilled(): boolean {
    switch (this.data?.type) {
      case 'Transaction':
        return this.transactionForm.valid;
      case 'Account':
        return this.accountForm.valid;
      case 'Category':
        return this.categoryForm.valid;
    }
    return false;
  }

  ngOnInit(): void {
    this.title = this.data?.title;
    this.message = this.data?.message;
    switch (this.data?.type) {
      case 'Notification':
        this.notification = true;
        break;
      case 'Account':
        this.creatingAccount = true;
        this.fillCurrencies();
        break;
      case 'Transaction':
        this.creatingTransaction = true;
        break;
      case 'Category':
        this.creatingCategory = true;
        break;
    }

    this.subscription = this.categoryService
      .getCategoryList$()
      .subscribe((result) => {
        this.categories = result.categories;
      });
  }

  onCreate(): void {
    switch (this.data?.type) {
      case 'Transaction':
        this.transactionService.createTransaction(this.transactionForm.value);
        break;
      case 'Account':
        this.dialogService.createAccount(this.accountForm.value);
        break;
      case 'Category':
        this.categoryService.createCategory(this.categoryForm.value);
        break;
    }
  }
}

interface Type {
  value: string;
  viewValue: string;
}

interface Category {
  name: string;
  type: string;
}

interface Currency {
  currency: string;
  abbreviation: string;
  symbol: string;
}
