import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogService } from './services/dialog.service';

interface Currency {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; message: string; type: string },
    private dialogService: DialogService
  ) {}
  title: string = '';
  message: string = '';
  creatingTransaction: boolean = false;
  creatingAccount: boolean = false;
  notification: boolean = false;

  availableCurrencies: Currency[] = [{ value: '$', viewValue: '$' }];
  selectedValue: string = '';

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
    } else {
      this.notification = true;
    }
  }

  onCreate(): void {
    if (this.data?.type === 'Account') {
      this.dialogService.createAccount(this.accountForm.value);
    }
  }
}
