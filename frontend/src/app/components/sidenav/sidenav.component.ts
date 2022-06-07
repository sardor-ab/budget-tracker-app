import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SidenavService } from './services/sidenav.service';
import { AccountsService } from '../accounts/services/accounts.service';
import { CategoryService } from '../categories/service/category.service';
import { TransactionService } from '../transactions/service/transaction.service';
import { SubscriptionService } from '../subscriptions/service/subscription.service';
import { ICategory } from 'src/app/models/ResponceModels';
import { DialogService } from '../dialog/services/dialog.service';

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
    private dialogService: DialogService,
    private transactionService: TransactionService,
    private subscriptionService: SubscriptionService
  ) {
    const currentYear = new Date();
    this.maxDate = new Date(currentYear);
    this.minDate = new Date(currentYear);
  }

  private noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  durationUnits: Type[] = [
    { value: 'week', viewValue: 'week(-s)' },
    { value: 'month', viewValue: 'month(-s)' },
    { value: 'year', viewValue: 'year(-s)' },
  ];

  maxDate: Date;
  minDate: Date;
  subscription: Subscription = new Subscription();

  currentTransactionType: string = '';
  categoriesList: ICategory[] = [];
  preSelected: any[] = [];

  isCategoryEdit: boolean = false;

  isTransaction: boolean = false;
  isTransactionEdit: boolean = false;

  isAccount: boolean = false;
  isAccountEdit: boolean = false;

  isSubscription: boolean = false;
  isSubscriptionEdit: boolean = false;

  tempEndDateText: string = '';

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
    subscription?: {
      title: string;
      categoryList: {
        _id: string;
        name: string;
        // type: string;
      }[];
      amount: number;
      startDate: Date;
      endDate: Date;
      description: string;
      attachment: string;
      payee: string;
      _id: string;
      paymentRepetition: string;
      durationNumber: number;
    };
  };

  accountForm: FormGroup = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      this.noWhitespaceValidator,
    ]),
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
    title: new FormControl('', [
      Validators.required,
      this.noWhitespaceValidator,
    ]),
    type: new FormControl('', [Validators.required]),
    categories: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required, Validators.min(0.01)]),
    date: new FormControl('', [Validators.required]),
    payee: new FormControl('', [
      Validators.required,
      this.noWhitespaceValidator,
    ]),
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
    name: new FormControl('', [
      Validators.required,
      this.noWhitespaceValidator,
    ]),
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

  subscriptionForm: FormGroup = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      this.noWhitespaceValidator,
    ]),
    categoryList: new FormControl('', [Validators.required]),
    amount: new FormControl('', [
      Validators.required,
      Validators.min(0.01),
      Validators.pattern('^[0-9]*$'),
    ]),
    startDate: new FormControl('', [Validators.required]),
    durationNumber: new FormControl('', Validators.min(1)),
    durationUnit: new FormControl('', Validators.required),
    payee: new FormControl('', [
      Validators.required,
      this.noWhitespaceValidator,
    ]),
    description: new FormControl(''),
    attachment: new FormControl(''),
  });

  get subscriptionTitle() {
    return this.subscriptionForm.get('title');
  }

  get subscriptionDescription() {
    return this.subscriptionForm.get('description');
  }

  get subscriptionCategoryList() {
    return this.subscriptionForm.get('categoryList');
  }

  get subscriptionAmount() {
    return this.subscriptionForm.get('amount');
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

  get subscriptionPayee() {
    return this.subscriptionForm.get('payee');
  }

  ngOnInit(): void {
    this.subscription = this.dialogService
      .getDurationValue$()
      .subscribe((value: string) => {
        this.tempEndDateText = value;
      });

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
            this.isSubscription = false;
            this.isSubscriptionEdit = false;
            break;
          case 'Transaction':
            this.isAccount = false;
            this.isAccountEdit = false;
            this.isTransaction = true;
            this.isTransactionEdit = false;
            this.isCategoryEdit = false;
            this.isSubscription = false;
            this.isSubscriptionEdit = false;
            break;
          case 'Category':
            this.isCategoryEdit = true;
            this.isAccount = false;
            this.isAccountEdit = false;
            this.isTransaction = false;
            this.isTransactionEdit = false;
            this.isSubscription = false;
            this.isSubscriptionEdit = false;

            this.categoryTitle?.setValue(this.responce?.category?.name);
            this.categoryType?.setValue(this.responce?.category?.type);
            this.categoryForm
              ?.get('_id')
              ?.setValue(this.responce?.category?._id);
            break;
          case 'Subscription':
            this.isCategoryEdit = false;
            this.isAccount = false;
            this.isAccountEdit = false;
            this.isTransaction = false;
            this.isTransactionEdit = false;
            this.isSubscription = true;
            this.isSubscriptionEdit = false;
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
    switch (title) {
      case 'Account':
        this.isAccount = false;
        this.isAccountEdit = true;

        this.title?.setValue(this.responce.account?.title);
        this.description?.setValue(this.responce.account?.description);
        break;
      case 'Transaction':
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
        break;
      case 'Category':
        break;
      case 'Subscription':
        this.isSubscription = false;
        this.isSubscriptionEdit = true;

        this.subscriptionTitle?.setValue(this.responce.subscription?.title);
        this.subscriptionDescription?.setValue(
          this.responce.subscription?.description
        );
        this.setTransactionCategoryList('expense');

        this.responce.subscription?.categoryList.map((category) => {
          this.preSelected.push(category);
        });

        this.subscriptionCategoryList?.setValue(this.preSelected);
        this.subscriptionAmount?.setValue(this.responce.subscription?.amount);
        this.subscriptionStartDate?.setValue(
          this.responce.subscription?.startDate
        );

        this.subscriptionDurationNumber?.setValue(
          this.responce.subscription?.durationNumber +
            ' ' +
            this.responce.subscription?.paymentRepetition
        );
        const value = {
          number: this.responce.subscription?.durationNumber!,
          unit: this.responce.subscription?.paymentRepetition!,
        };
        this.dialogService.setChosenDurationValue(value);
        this.subscriptionPayee?.setValue(this.responce.subscription?.payee);

        break;
    }
  }

  onClose() {
    this.isAccount = false;
    this.isTransaction = false;
    this.isAccountEdit = false;
    this.isCategoryEdit = false;
    this.isTransactionEdit = false;
    this.isSubscription = false;
    this.isSubscriptionEdit = false;
    this.sidenavService.hideSideNav();
  }

  toggleBilingCycle() {
    this.dialogService.showDialog('Billing Cycle', 'Billing Cycle');
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
      case 'Subscription':
        this.subscriptionService.updateSubscription(
          this.subscriptionForm.value,
          this.responce.subscription?._id!
        );
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
      case 'Subscription':
        return this.subscriptionForm.valid;
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
    } else if (this.isSubscriptionEdit) {
      this.isSubscriptionEdit = false;
      this.isSubscription = true;
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
      case 'Subscription':
        this.subscriptionService.deleteSubscription(
          this.responce.subscription?._id!
        );
        break;
    }

    this.onClose();
  }

  openDurationPicker() {
    this.dialogService.showDialog('Subscription duration', 'Date');
  }
}
interface Type {
  value: string;
  viewValue: string;
}
