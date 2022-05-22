import { Subscription } from 'rxjs';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/config/services/category/category.service';
import { DialogService } from './services/dialog.service';
import { CurrencyService } from 'src/app/config/services/currency/currency.service';

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
    this.fillCategories(value);
    this.transactionCategories?.enable();
  }

  fillCategories(value: string) {
    this.subscription = this.categoryService
      .getCategories(value)
      .subscribe((categories) => {
        if (categories.success) {
          this.categories = categories.data;
        }
      });
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

  ngOnInit(): void {
    this.title = this.data?.title;
    this.message = this.data?.message;
    if (this.data?.type === 'Transaction') {
      this.creatingTransaction = true;
    } else if (this.data?.type === 'Account') {
      this.creatingAccount = true;
      this.fillCurrencies();
    } else {
      this.notification = true;
    }
  }

  onCreate(): void {
    if (this.data?.type === 'Account') {
      this.dialogService.createAccount(this.accountForm.value);
    } else if (this.data?.type === 'Transaction') {
      this.dialogService.createTransaction(this.transactionForm.value);
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
