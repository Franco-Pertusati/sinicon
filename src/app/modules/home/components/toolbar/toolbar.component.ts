import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeToggleBtnComponent } from "../../../../prt-ui/theme-toggle-btn/theme-toggle-btn.component";
import { ShiftService } from '../../../../core/services/shift.service';
import { WineService } from '../../../../core/services/wine.service';

@Component({
  selector: 'app-toolbar',
  imports: [CommonModule, ThemeToggleBtnComponent],
  templateUrl: './toolbar.component.html'
})
export class ToolbarComponent {
  private shiftService = inject(ShiftService);
  private wineService = inject(WineService);

  get openShift() {
    return this.shiftService.openShift$();
  }

  get shiftTime(): string {
    const shift = this.openShift;
    if (!shift) return 'Sin turno abierto';
    
    const date = new Date(shift.openedAt);
    const formatter = new Intl.DateTimeFormat('es-AR', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit'
    });
    
    return formatter.format(date);
  }

  get totalWines(): number {
    return this.openShift?.orders.length ?? 0;
  }
}
