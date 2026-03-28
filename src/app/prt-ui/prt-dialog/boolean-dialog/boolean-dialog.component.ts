import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { PrtButton } from "../../prt-button/prt-button.component";
import { DialogService } from '../../../core/services/dialog.service';

@Component({
  selector: 'app-boolean-dialog',
  imports: [PrtButton],
  templateUrl: './boolean-dialog.component.html'
})
export class BooleanDialogComponent {
  dialog = inject(DialogService)

  confirm(value: boolean) {
    this.dialog.dialogConfig()?.data.resolve(value);
    this.dialog.closeDialog();
  }
}
