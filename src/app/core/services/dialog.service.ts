import { Injectable, signal, Type } from '@angular/core';
import { BooleanDialogComponent } from '../../prt-ui/prt-dialog/boolean-dialog/boolean-dialog.component';

export interface DialogConfig<T = any> {
  component: Type<T> | null;
  data?: T;
  showCloseButton?: boolean;
}

export interface DialogMessage {
  title?: string,
  description?: String,
  trueBtnText?: string,
  falseBtnText?: String
}

@Injectable({
  providedIn: 'root'
})

export class DialogService {
  isDialogOpen = signal<boolean>(false);
  dialogConfig = signal<DialogConfig | null>(null);

  openDialog<T>(component: Type<T>, data?: T, showCloseButton = true) {
    this.dialogConfig.set({ component, data, showCloseButton });
    this.isDialogOpen.set(true);
  }

  closeDialog() {
    this.isDialogOpen.set(false);
    this.dialogConfig.set(null);
  }

  openBooleanDialog(message: DialogMessage): Promise<boolean> {
    return new Promise((resolve) => {
      this.dialogConfig.set({
        component: BooleanDialogComponent,
        data: { message, resolve },
        showCloseButton: false,
      });
      this.isDialogOpen.set(true);
    });
  }
}
