import { Injectable } from '@angular/core';
import { WineRecord } from '../interfaces/wineRecord';

@Injectable({
  providedIn: 'root',
})
export class WineService {
  private readonly STORAGE_KEY = 'wine_records';

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  private load(): WineRecord[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as Array<Omit<WineRecord, 'createdAt'> & { createdAt: string }>;
    return parsed.map((r) => ({ ...r, createdAt: new Date(r.createdAt) }));
  }

  private save(records: WineRecord[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
  }

  // ─── CRUD ────────────────────────────────────────────────────────────────────

  /** Returns all records, sorted from newest to oldest */
  getAll(): WineRecord[] {
    return this.load().sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  /** Returns a record by its id, or undefined if not found */
  getById(id: string): WineRecord | undefined {
    return this.load().find((r) => r.id === id);
  }

  /** Creates a new record and persists it; returns the created record */
  create(data: Omit<WineRecord, 'id' | 'createdAt'>): WineRecord {
    const records = this.load();

    const newRecord: WineRecord = {
      id: this.generateId(),
      createdAt: new Date(),
      ...data,
    };

    this.save([...records, newRecord]);
    return newRecord;
  }

  /** Updates the given fields of a record; returns the updated record or null if not found */
  update(id: string, changes: Partial<Omit<WineRecord, 'id' | 'createdAt'>>): WineRecord | null {
    const records = this.load();
    const index = records.findIndex((r) => r.id === id);

    if (index === -1) return null;

    records[index] = { ...records[index], ...changes };
    this.save(records);
    return records[index];
  }

  /** Deletes a record by id; returns true if found and deleted */
  delete(id: string): boolean {
    const records = this.load();
    const filtered = records.filter((r) => r.id !== id);

    if (filtered.length === records.length) return false;

    this.save(filtered);
    return true;
  }

  /** Removes all records from storage */
  clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}