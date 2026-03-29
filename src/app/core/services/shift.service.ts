import { Injectable, signal, computed } from '@angular/core';
import { Shift } from '../interfaces/shift';
import { WineRecord } from '../interfaces/wineRecord';

@Injectable({
  providedIn: 'root',
})
export class ShiftService {
  private readonly STORAGE_KEY = 'shifts';
  private shiftsSignal = signal<Shift[]>(this.load());
  readonly openShift$ = computed(() => this.shiftsSignal().find((s) => s.isOpen) ?? null);

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  private deserializeShift(raw: any): Shift {
    return {
      ...raw,
      openedAt: new Date(raw.openedAt),
      closedAt: raw.closedAt ? new Date(raw.closedAt) : null,
      orders: (raw.orders as any[]).map((o) => ({
        ...o,
        createdAt: new Date(o.createdAt),
      })),
    };
  }

  private load(): Shift[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as any[]).map(this.deserializeShift);
  }

  private save(shifts: Shift[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(shifts));
    this.shiftsSignal.set(shifts);
  }

  // ─── Shift lifecycle ─────────────────────────────────────────────────────────

  /** Opens a new shift. Throws if one is already open. */
  openShift(): Shift {
    if (this.getOpenShift()) {
      throw new Error('A shift is already open. Close it before opening a new one.');
    }

    const shift: Shift = {
      id: this.generateId(),
      openedAt: new Date(),
      closedAt: null,
      orders: [],
      isOpen: true,
    };

    this.save([...this.load(), shift]);
    return shift;
  }

  /** Closes the active shift. Returns the closed shift or null if none was open. */
  closeShift(): Shift | null {
    const shifts = this.load();
    const index = shifts.findIndex((s) => s.isOpen);

    if (index === -1) return null;

    shifts[index] = {
      ...shifts[index],
      closedAt: new Date(),
      isOpen: false,
    };

    this.save(shifts);
    return shifts[index];
  }

  /** Returns the currently open shift, or null if there is none. */
  getOpenShift(): Shift | null {
    return this.openShift$();
  }

  // ─── Queries ─────────────────────────────────────────────────────────────────

  /** Returns all shifts, sorted from newest to oldest. */
  getAll(): Shift[] {
    return this.shiftsSignal().sort((a, b) => b.openedAt.getTime() - a.openedAt.getTime());
  }

  /** Returns a shift by id, or undefined if not found. */
  getById(id: string): Shift | undefined {
    return this.shiftsSignal().find((s) => s.id === id);
  }

  // ─── Order management ────────────────────────────────────────────────────────

  /** Adds an order to the open shift. Throws if no shift is active. */
  addOrder(order: WineRecord): Shift {
    const shifts = this.load();
    const index = shifts.findIndex((s) => s.isOpen);

    if (index === -1) {
      throw new Error('No shift is currently open. Open a shift before adding orders.');
    }

    shifts[index].orders = [...shifts[index].orders, order];
    this.save(shifts);
    return shifts[index];
  }

  /** Removes an order from the open shift by order id. Returns the updated shift or null. */
  removeOrder(orderId: string): Shift | null {
    const shifts = this.load();
    const index = shifts.findIndex((s) => s.isOpen);

    if (index === -1) return null;

    shifts[index].orders = shifts[index].orders.filter((o) => o.id !== orderId);
    this.save(shifts);
    return shifts[index];
  }

  /** Returns the orders of the current open shift, or an empty array if none. */
  getCurrentOrders(): WineRecord[] {
    return this.getOpenShift()?.orders ?? [];
  }

  /** Returns the orders of a specific shift by id. */
  getOrdersByShift(shiftId: string): WineRecord[] {
    return this.getById(shiftId)?.orders ?? [];
  }

  // ─── Export ──────────────────────────────────────────────────────────────────

  /** Generates a CSV string from a shift's orders */
  private generateCSV(shift: Shift): string {
    const headers = ['Nombre del Vino', 'Tipo', 'Mozo', 'Mesa', 'Hora'];
    const headerRow = headers.join(',') + '\n';
    
    const dataRows = shift.orders
      .map((order: WineRecord) => {
        const time = new Date(order.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
        return [
          this.escapeCSV(order.name),
          this.escapeCSV(order.type),
          this.escapeCSV(order.waiter),
          this.escapeCSV(order.table),
          time
        ].join(',');
      })
      .join('\n');

    // Add summary section
    const openedAt = new Date(shift.openedAt).toLocaleString('es-AR');
    const closedAt = shift.closedAt ? new Date(shift.closedAt).toLocaleString('es-AR') : 'Abierto';
    const totalOrders = shift.orders.length;
    
    const summary = `\n\nResumen del Turno\nID del Turno,${shift.id}\nAbierto,${openedAt}\nCerrado,${closedAt}\nTotal de Registros,${totalOrders}`;

    return headerRow + dataRows + summary;
  }

  /** Escapes a value for CSV format */
  private escapeCSV(value: string): string {
    if (!value) return '';
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  /** Downloads a CSV file */
  private downloadCSV(csv: string, shiftId: string): void {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `turno_${shiftId}_${new Date().getTime()}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  /** Exports a shift by id as CSV */
  exportShift(shiftId: string): boolean {
    const shift = this.getById(shiftId);
    
    if (!shift) {
      return false;
    }

    const csv = this.generateCSV(shift);
    this.downloadCSV(csv, shiftId);
    return true;
  }

  // ─── Cleanup ─────────────────────────────────────────────────────────────────

  /** Removes all shifts from storage. */
  clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}