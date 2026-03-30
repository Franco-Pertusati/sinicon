import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrtButton } from "../../../../prt-ui/prt-button/prt-button.component";
import { NoShiftComponent } from "../no-shift/no-shift.component";
import { ShiftService } from '../../../../core/services/shift.service';
import { DialogService } from '../../../../core/services/dialog.service';
import { FormDialogComponent } from '../../components/form-dialog/form-dialog.component';
import { WineRecord } from '../../../../core/interfaces/wineRecord';

@Component({
  selector: 'app-current-shift',
  imports: [CommonModule, PrtButton, NoShiftComponent],
  templateUrl: './current-shift.component.html'
})
export class CurrentShiftComponent {
  private shiftService = inject(ShiftService);
  private dialog = inject(DialogService)

  openShift = this.shiftService.openShift$;
  
  contextMenu = signal<{ visible: boolean; x: number; y: number; wine: WineRecord | null }>({ 
    visible: false, 
    x: 0, 
    y: 0,
    wine: null
  });
  
  get wines() {
    return this.openShift()?.orders ?? [];
  }

  openFormDialog() {
    this.dialog.openDialog(FormDialogComponent)
  }

  onWineContextMenu(event: MouseEvent, wine: WineRecord) {
    event.preventDefault();
    this.contextMenu.set({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      wine: wine
    });
  }

  closeContextMenu() {
    this.contextMenu.set({ visible: false, x: 0, y: 0, wine: null });
  }

  @HostListener('click')
  onClickAnywhere() {
    this.closeContextMenu();
  }

  onRecordRepeat() {
    const wine = this.contextMenu().wine;
    if (wine) {
      const newOrder: WineRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        name: wine.name,
        waiter: wine.waiter,
        table: wine.table,
        createdAt: new Date()
      };
      this.shiftService.addOrder(newOrder);
    }
    this.closeContextMenu();
  }
}
