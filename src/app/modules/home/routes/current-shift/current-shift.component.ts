import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrtButton } from "../../../../prt-ui/prt-button/prt-button.component";
import { NoShiftComponent } from "../no-shift/no-shift.component";
import { ShiftService } from '../../../../core/services/shift.service';
import { DialogService } from '../../../../core/services/dialog.service';
import { FormDialogComponent } from '../../components/form-dialog/form-dialog.component';

@Component({
  selector: 'app-current-shift',
  imports: [CommonModule, PrtButton, NoShiftComponent],
  templateUrl: './current-shift.component.html'
})
export class CurrentShiftComponent {
  private shiftService = inject(ShiftService);
  private dialog = inject(DialogService)

  openShift = this.shiftService.openShift$;
  
  get wines() {
    return this.openShift()?.orders ?? [];
  }

  openFormDialog() {
    this.dialog.openDialog(FormDialogComponent)
  }
}
