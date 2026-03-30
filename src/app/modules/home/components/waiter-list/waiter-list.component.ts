import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WaiterService } from '../../../../core/services/waiter.service';
import { Waiter } from '../../../../core/interfaces/waiter';

@Component({
  selector: 'app-waiter-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './waiter-list.component.html'
})
export class WaiterListComponent {
  waiters = signal<Waiter[]>([]);
  formData = signal({ name: '' });

  constructor(private waiterService: WaiterService) {
    this.loadWaiters();
  }

  loadWaiters(): void {
    this.waiters.set(this.waiterService.getAll());
  }

  createWaiter(): void {
    if (this.formData().name.trim()) {
      this.waiterService.create({ name: this.formData().name });
      this.formData.set({ name: '' });
      this.loadWaiters();
    }
  }

  deleteWaiter(id: string): void {
    this.waiterService.delete(id);
    this.loadWaiters();
  }
}
