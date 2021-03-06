import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDividerModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
  ],
  exports: [
    MatInputModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDividerModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
  ],
})
export class SharedModule {}
