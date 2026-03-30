import { Injectable } from '@angular/core';
import { Wine } from '../interfaces/wine';

@Injectable({
  providedIn: 'root',
})
export class WineListService {
  private readonly STORAGE_KEY = 'wines';

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  private load(): Wine[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as Array<Omit<Wine, 'createdAt'> & { createdAt: string }>;
    return parsed.map((r) => ({ ...r, createdAt: new Date(r.createdAt) }));
  }

  private save(records: Wine[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
  }

  // ─── CRUD ────────────────────────────────────────────────────────────────────

  /** Returns all wines, sorted from newest to oldest */
  getAll(): Wine[] {
    return this.load().sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  /** Returns a wine by its id, or undefined if not found */
  getById(id: string): Wine | undefined {
    return this.load().find((r) => r.id === id);
  }

  /** Creates a new wine and persists it; returns the created wine */
  create(data: Omit<Wine, 'id' | 'createdAt'>): Wine {
    const records = this.load();

    const newRecord: Wine = {
      id: this.generateId(),
      createdAt: new Date(),
      ...data,
    };

    this.save([...records, newRecord]);
    return newRecord;
  }

  /** Updates the given fields of a wine; returns the updated wine or null if not found */
  update(id: string, changes: Partial<Omit<Wine, 'id' | 'createdAt'>>): Wine | null {
    const records = this.load();
    const index = records.findIndex((r) => r.id === id);

    if (index === -1) return null;

    records[index] = { ...records[index], ...changes };
    this.save(records);
    return records[index];
  }

  /** Deletes a wine by id; returns true if found and deleted */
  delete(id: string): boolean {
    const records = this.load();
    const filtered = records.filter((r) => r.id !== id);

    if (filtered.length === records.length) return false;

    this.save(filtered);
    return true;
  }

  /** Removes all wines from storage */
  clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
