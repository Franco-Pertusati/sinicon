import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrtButton } from '../../../../prt-ui/prt-button/prt-button.component';
import { WineService } from '../../../../core/services/wine.service';
import { WineListService } from '../../../../core/services/wine-list.service';
import { WaiterService } from '../../../../core/services/waiter.service';
import { DialogService } from '../../../../core/services/dialog.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ShiftService } from '../../../../core/services/shift.service';
import { Wine } from '../../../../core/interfaces/wine';
import { Waiter } from '../../../../core/interfaces/waiter';

@Component({
  selector: 'app-form-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, PrtButton],
  templateUrl: './form-dialog.component.html',
})
export class FormDialogComponent {
  private wineService = inject(WineService);
  private wineListService = inject(WineListService);
  private waiterService = inject(WaiterService);
  private dialogService = inject(DialogService);
  private toastService = inject(ToastService);
  private shiftService = inject(ShiftService);

  // Form fields
  selectedWineId = signal<string>('');
  searchFilter = signal<string>('');
  selectedWaiterId = signal<string>('');
  table = signal<string>('');
  isLoading = signal<boolean>(false);
  wines = signal<Wine[]>(this.wineListService.getAll());
  waiters = signal<Waiter[]>(this.waiterService.getAll());

  filteredWines = computed(() => {
    const search = this.searchFilter().toLowerCase().trim();
    if (!search) return this.wines();
    
    return this.wines().filter(wine => 
      wine.name.toLowerCase().includes(search)
    );
  });

  hasNoMatches = computed(() => {
    return this.searchFilter().trim() !== '' && this.filteredWines().length === 0;
  });

  constructor() {
    effect(() => {
      // Recargar vinos cuando cambia el filtro
      this.wines.set(this.wineListService.getAll());
      this.waiters.set(this.waiterService.getAll());
    });
  }

  selectWine(wineId: string) {
    this.selectedWineId.set(wineId);
  }

  selectWaiter(waiterId: string) {
    this.selectedWaiterId.set(waiterId);
  }

  createAndSelectWine() {
    const wineName = this.searchFilter().trim();
    
    if (!wineName) {
      this.toastService.default('error', 'Escribe el nombre del vino');
      return;
    }

    const newWine = this.wineListService.create({ name: wineName });
    this.wines.set(this.wineListService.getAll());
    this.selectedWineId.set(newWine.id);
    this.searchFilter.set('');
    this.toastService.success('Vino creado');
  }

  onSubmit() {
    // Validation
    if (!this.selectedWineId()) {
      this.toastService.default('error', 'Selecciona un vino');
      return;
    }
    if (!this.selectedWaiterId()) {
      this.toastService.default('error', 'Selecciona un mozo');
      return;
    }
    if (!this.table().trim()) {
      this.toastService.default('error', 'Escribe el número de mesa');
      return;
    }

    this.isLoading.set(true);

    try {
      const waiter = this.waiterService.getById(this.selectedWaiterId());
      const newRecord = this.wineService.create({
        wineId: this.selectedWineId(),
        waiter: waiter?.name || '',
        table: this.table().trim()
      });

      // Add the record to the current open shift
      this.shiftService.addOrder(newRecord);

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
