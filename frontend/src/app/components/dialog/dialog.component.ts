import { Subscription } from 'rxjs';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from './services/dialog.service';
import { CategoryService } from '../categories/service/category.service';
import { TransactionService } from '../transactions/service/transaction.service';
import { CurrencyService } from 'src/app/config/services/currency/currency.service';
import { SubscriptionService } from '../subscriptions/service/subscription.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      message: string;
      type: string;
      date: {
        number: number;
        unit: string;
      };
    },
    private dialogService: DialogService,
    private currencyService: CurrencyService,
    private categoryService: CategoryService,
    private transactionService: TransactionService,
    private subscriptionService: SubscriptionService
  ) {
    const currentYear = new Date();
    this.maxDate = new Date(currentYear);
    this.minDate = new Date(currentYear);
    this.subscription = this.dialogService
      .setCurrentCurrency()
      .subscribe((currency: string) => {
        this.currentCurrency = currency;
      });
  }
  maxDate: Date;
  minDate: Date;

  subscription: Subscription = new Subscription();

  private noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  title: string = '';
  message: string = '';
  selectedCategory: string = '';
  tempText: string = '';

  notification: boolean = false;
  creatingAccount: boolean = false;
  choosingDuration: boolean = false;
  creatingCategory: boolean = false;
  creatingTransaction: boolean = false;
  creatingSubscription: boolean = false;

  typeSelected: boolean = false;

  currentCurrency: string = '';

  availableCurrencies!: Currency[];
  selectedValue: string = '';

  durationUnits: Type[] = [
    { value: 'week', viewValue: 'week(-s)' },
    { value: 'month', viewValue: 'month(-s)' },
    { value: 'year', viewValue: 'year(-s)' },
  ];

  subscriptionTypes: Type[] = [
    { value: 'week', viewValue: 'Once a week' },
    { value: 'month', viewValue: 'Once a month' },
    { value: 'year', viewValue: 'Once a year' },
  ];

  types: Type[] = [
    { value: 'income', viewValue: 'Income' },
    { value: 'expense', viewValue: 'Expense' },
  ];

  categories!: Category[];

  transactionForm: FormGroup = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      this.noWhitespaceValidator,
    ]),
    type: new FormControl('', Validators.required),
    categories: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    amount: new FormControl('', [Validators.required, Validators.min(0)]),
    payee: new FormControl('', [
      Validators.required,
      this.noWhitespaceValidator,
    ]),
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
    title: new FormControl('', [
      Validators.required,
      this.noWhitespaceValidator,
    ]),
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
    name: new FormControl('', [
      Validators.required,
      this.noWhitespaceValidator,
    ]),
    type: new FormControl('', [Validators.required]),
  });

  get categoryTitle() {
    return this.categoryForm.get('name');
  }

  get categoryType() {
    return this.categoryForm.get('type');
  }

  subscriptionForm: FormGroup = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      this.noWhitespaceValidator,
    ]),
    description: new FormControl(''),
    startDate: new FormControl('', Validators.required),
    durationNumber: new FormControl(''),
    durationUnit: new FormControl(''),
    amount: new FormControl('', [Validators.required, Validators.min(0)]),
    categoryList: new FormControl('', Validators.required),
    payee: new FormControl('', [
      Validators.required,
      this.noWhitespaceValidator,
    ]),
  });

  get subscriptionTitle() {
    return this.subscriptionForm.get('title');
  }

  get subscriptionStartDate() {
    return this.subscriptionForm.get('startDate');
  }

  get subscriptionDurationNumber() {
    return this.subscriptionForm.get('durationNumber');
  }

  get subscriptionDurationUnit() {
    return this.subscriptionForm.get('durationUnit');
  }

  get subscriptionAmount() {
    return this.subscriptionForm.get('amount');
  }

  get subscriptionCategoryList() {
    return this.subscriptionForm.get('categoryList');
  }

  get subscriptionPayee() {
    return this.subscriptionForm.get('payee');
  }

  durationForm: FormGroup = new FormGroup({
    number: new FormControl('', [Validators.required, Validators.min(1)]),
    unit: new FormControl('', [Validators.required]),
  });

  get durationNumber() {
    return this.durationForm.get('number');
  }

  get durationUnit() {
    return this.durationForm.get('unit');
  }

  isFormFilled(): boolean {
    switch (this.data?.type) {
      case 'Transaction':
        return this.transactionForm.valid;
      case 'Account':
        return this.accountForm.valid;
      case 'Category':
        return this.categoryForm.valid;
      case 'Subscription':
        return this.subscriptionForm.valid;
      case 'Date':
        return this.durationForm.valid;
    }
    return false;
  }

  ngOnInit(): void {
    this.title = this.data?.title;
    this.message = this.data?.message;
    this.fillCurrencies();

    this.subscription = this.dialogService
      .getChosenDurationValue$()
      .subscribe((values) => {
        this.durationNumber?.setValue(values.number);
        this.durationUnit?.setValue(values.unit);

        this.subscriptionDurationNumber?.setValue(values.number);
        this.subscriptionDurationUnit?.setValue(values.unit);
      });

    this.subscription = this.categoryService
      .getCategoryList$()
      .subscribe((result) => {
        this.categories = result.categories;
      });

    this.subscription = this.dialogService
      .getDurationValue$()
      .subscribe((value: string) => {
        this.tempText = value;
      });

    switch (this.data?.type) {
      case 'Notification':
        this.notification = true;
        break;
      case 'Account':
        this.creatingAccount = true;
        break;
      case 'Transaction':
        this.creatingTransaction = true;
        break;
      case 'Category':
        this.creatingCategory = true;
        break;
      case 'Subscription':
        this.creatingSubscription = true;
        this.categoryService.getCategories('expense');
        break;
      case 'Date':
        this.choosingDuration = true;
        this.durationNumber?.setValue(1);
        this.durationUnit?.setValue('year');
        break;
    }
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
      case 'Subscription':
        this.subscriptionDurationNumber?.setValue(this.durationNumber?.value);
        if (this.subscriptionDurationNumber?.value === '') {
          this.subscriptionDurationNumber?.setValue(12);
        }
        this.subscriptionDurationUnit?.setValue(this.durationUnit?.value);
        if (this.subscriptionDurationUnit?.value === '') {
          this.subscriptionDurationUnit?.setValue('month');
        }

        this.subscriptionService.createSubscription(
          this.subscriptionForm.value
        );
        break;
    }
  }

  openDurationPicker(): void {
    this.dialogService.showDialog('Subscription duration', 'Date');
  }

  onProceed(): void {
    this.tempText = this.durationNumber?.value + ' ' + this.durationUnit?.value;
    const value = {
      number: this.durationNumber?.value,
      unit: this.durationUnit?.value,
    };
    this.dialogService.setChosenDurationValue(value);
    this.dialogService.setDuration(this.tempText);
  }
}

interface Type {
  value?: string;
  repetiton?: number;
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
