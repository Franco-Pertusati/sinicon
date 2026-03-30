import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WineListService } from '../../../../core/services/wine-list.service';
import { WineService } from '../../../../core/services/wine.service';
import { Wine } from '../../../../core/interfaces/wine';
import { WineRecord } from '../../../../core/interfaces/wineRecord';

@Component({
  selector: 'app-wine-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './wine-list.component.html'
})
export class WineListComponent {
  wines = signal<Wine[]>([]);
  records = signal<WineRecord[]>([]);
  wineFormData = signal({ name: '' });
  recordFormData = signal({ wineId: '', waiter: '', table: '' });

  constructor(
    private wineListService: WineListService,
    private wineService: WineService
  ) {
    this.loadWines();
    this.loadRecords();
  }

  loadWines(): void {
    this.wines.set(this.wineListService.getAll());
  }

  loadRecords(): void {
    this.records.set(this.wineService.getAll());
  }

  createWine(): void {
    if (this.wineFormData().name.trim()) {
      this.wineListService.create({ name: this.wineFormData().name });
      this.wineFormData.set({ name: '' });
      this.loadWines();
    }
  }

  deleteWine(id: string): void {
    this.wineListService.delete(id);
    this.loadWines();
  }

  createRecord(): void {
    const { wineId, waiter, table } = this.recordFormData();
    if (wineId.trim() && waiter.trim() && table.trim()) {
      this.wineService.create({ wineId, waiter, table });
      this.recordFormData.set({ wineId: '', waiter: '', table: '' });
      this.loadRecords();
    }
  }

  deleteRecord(id: string): void {
    this.wineService.delete(id);
    this.loadRecords();
  }

  getWineName(wineId: string): string {
    return this.wineListService.getById(wineId)?.name || 'Vino desconocido';
  }
}
