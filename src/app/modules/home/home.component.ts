import { Component, input, model, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import { RadioOption, PrtRadioComponent } from '../../prt-ui/prt-radio/prt-radio.component';
import { PrtButton } from "../../prt-ui/prt-button/prt-button.component";
import { CurrentShiftComponent } from "./routes/current-shift/current-shift.component";
import { HistoryComponent } from "./routes/history/history.component";
import { ShiftService } from '../../core/services/shift.service';
import { ToastService } from '../../core/services/toast.service';
import { DataComponent } from "./routes/data/data.component";

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, ToolbarComponent, PrtRadioComponent, PrtButton, CurrentShiftComponent, HistoryComponent, DataComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  selectedPage = model<string>('3')
  private shiftService = inject(ShiftService);
  private toastService = inject(ToastService);
  radioOptions: RadioOption[] = [
    {
      value: '1',
      label: 'Turno Actual',
      icon: 'home'
    },
    {
      value: '2',
      label: 'Historial',
      icon: 'history'
    },
    {
      value: '3',
      label: 'Data',
      icon: 'database'
    }
  ]

  closeAndExport() {
    try {
      const closedShift = this.shiftService.closeShift();
      
      if (!closedShift) {
        this.toastService.default('error', 'No hay turno abierto para cerrar');
        return;
      }

      // Export using service
      const exported = this.shiftService.exportShift(closedShift.id);
      
      if (exported) {
        this.toastService.success('success', 'Turno cerrado y exportado exitosamente');
      } else {
        this.toastService.default('error', 'Error al exportar el turno');
      }
    } catch (error) {
      this.toastService.default('error', 'Error al cerrar y exportar el turno');
      console.error(error);
    }
  }
}
