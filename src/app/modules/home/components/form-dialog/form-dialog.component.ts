import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrtButton } from '../../../../prt-ui/prt-button/prt-button.component';
import { WineService } from '../../../../core/services/wine.service';
import { DialogService } from '../../../../core/services/dialog.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ShiftService } from '../../../../core/services/shift.service';

@Component({
  selector: 'app-form-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, PrtButton],
  templateUrl: './form-dialog.component.html',
})
export class FormDialogComponent {
  private wineService = inject(WineService);
  private dialogService = inject(DialogService);
  private toastService = inject(ToastService);
  private shiftService = inject(ShiftService);

  // Form fields
  name = signal<string>('');
  type = signal<string>('');
  waiter = signal<string>('');
  table = signal<string>('');
  isLoading = signal<boolean>(false);

  // Wine types options
  wineTypes = ['Malbec', 'Chardonnay', 'Pinot Noir', 'Cabernet Franc', 'Cabernet Sauvignon', 'Sauvignon Blanc', 'Merlot', 'Rosé', 'Moscato', 'Semillón', 'Torrontés'];

  onSubmit() {
    // Validation
    if (!this.name().trim()) {
      this.toastService.default('error', 'Escribe el nombre del vino');
      return;
    }
    if (!this.type()) {
      this.toastService.default('error', 'Selecciona un tipo de vino');
      return;
    }
    if (!this.waiter().trim()) {
      this.toastService.default('error', 'Escribe el nombre del mozo');
      return;
    }
    if (!this.table().trim()) {
      this.toastService.default('error', 'Selecciona o escribe la mesa');
      return;
    }

    this.isLoading.set(true);

    try {
      const newWine = this.wineService.create({
        name: this.name().trim(),
        type: this.type(),
        waiter: this.waiter().trim(),
        table: this.table().trim()
      });

      // Add the wine to the current open shift
      this.shiftService.addOrder(newWine);

      this.toastService.success('Registro creado');
      this.dialogService.closeDialog();
    } catch (error) {
      this.toastService.default('error', 'Error al crear el registro');
      console.error(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  onCancel() {
    this.dialogService.closeDialog();
  }
}
