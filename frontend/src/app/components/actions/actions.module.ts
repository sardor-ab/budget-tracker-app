import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActionsComponent } from './actions.component';
import { ActionComponent } from './action/action.component';

@NgModule({
  declarations: [ActionsComponent, ActionComponent],
  imports: [CommonModule, SharedModule],
  exports: [ActionsComponent, ActionsComponent],
})
export class ActionsModule {}
