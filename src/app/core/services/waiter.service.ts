import { Injectable } from '@angular/core';
import { Waiter } from '../interfaces/waiter';

@Injectable({
  providedIn: 'root',
})
export class WaiterService {
  private readonly STORAGE_KEY = 'waiters';

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  private load(): Waiter[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as Array<Omit<Waiter, 'createdAt'> & { createdAt: string }>;
    return parsed.map((r) => ({ ...r, createdAt: new Date(r.createdAt) }));
  }

  private save(records: Waiter[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
  }

  // ─── CRUD ────────────────────────────────────────────────────────────────────

  /** Returns all waiters, sorted from newest to oldest */
  getAll(): Waiter[] {
    return this.load().sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  /** Returns a waiter by its id, or undefined if not found */
  getById(id: string): Waiter | undefined {
    return this.load().find((r) => r.id === id);
  }

  /** Creates a new waiter and persists it; returns the created waiter */
  create(data: Omit<Waiter, 'id' | 'createdAt'>): Waiter {
    const records = this.load();

    const newRecord: Waiter = {
      id: this.generateId(),
      createdAt: new Date(),
      ...data,
    };

    this.save([...records, newRecord]);
    return newRecord;
  }

  /** Updates the given fields of a waiter; returns the updated waiter or null if not found */
  update(id: string, changes: Partial<Omit<Waiter, 'id' | 'createdAt'>>): Waiter | null {
    const records = this.load();
    const index = records.findIndex((r) => r.id === id);

    if (index === -1) return null;

    records[index] = { ...records[index], ...changes };
    this.save(records);
    return records[index];
  }

  /** Deletes a waiter by id; returns true if found and deleted */
  delete(id: string): boolean {
    const records = this.load();
    const filtered = records.filter((r) => r.id !== id);

    if (filtered.length === records.length) return false;

    this.save(filtered);
    return true;
  }

  /** Removes all waiters from storage */
  clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
