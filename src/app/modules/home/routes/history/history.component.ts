import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShiftService } from '../../../../core/services/shift.service';
import { ToastService } from '../../../../core/services/toast.service';
import { PrtButton } from "../../../../prt-ui/prt-button/prt-button.component";

@Component({
  selector: 'app-history',
  imports: [CommonModule, PrtButton],
  templateUrl: './history.component.html'
})
export class HistoryComponent {
  private shiftService = inject(ShiftService);
  private toastService = inject(ToastService);

  get shifts() {
    return this.shiftService.getAll();
  }

  exportShift(shiftId: string) {
    try {
      const exported = this.shiftService.exportShift(shiftId);
      
      if (exported) {
        this.toastService.success('success', 'Turno exportado exitosamente');
      } else {
        this.toastService.default('error', 'No se encontró el turno');
      }
    } catch (error) {
      this.toastService.default('error', 'Error al exportar el turno');
      console.error(error);
    }
  }
}
