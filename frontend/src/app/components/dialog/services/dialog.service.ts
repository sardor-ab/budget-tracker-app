import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, asyncScheduler, Subject } from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { DialogComponent } from '../dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  private openDialog$: Subject<boolean> = new BehaviorSubject<boolean>(false);
  private dialogMessage = new BehaviorSubject<string>('');
  public showMessage = this.dialogMessage.asObservable();

  provideMessage(message: string) {
    this.dialogMessage.next(message);
  }

  isOpenDialog$() {
    return this.openDialog$.asObservable().pipe(observeOn(asyncScheduler));
  }

  getMessage() {
    return this.dialogMessage.getValue();
  }

  showDialog(title: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      restoreFocus: false,
      data: {
        title,
        message: this.getMessage(),
      },
    });

    dialogRef.afterClosed().subscribe((data) => {
      console.log(data);
      this.openDialog$.next(false);
    });
    // this.openDialog$.next(true);
  }

  hideDialog() {
    this.openDialog$.next(false);
  }
}
