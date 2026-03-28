import { Component, inject, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { DialogService } from '../../../core/services/dialog.service';
import { PrtButton } from "../../prt-button/prt-button.component";

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [PrtButton],
  templateUrl: './dialog.component.html',
})
export class DialogComponent implements AfterViewInit, OnDestroy {
  @ViewChild('closeButton', { read: ElementRef }) closeButtonRef!: ElementRef;

  dialogService = inject(DialogService);
  private handleKeyDown!: (e: KeyboardEvent) => void;

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  closeDialog() {
    this.dialogService.closeDialog();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.focusCloseButton();
      this.setupFocusTrap();
    }, 0);
  }

  ngOnDestroy() {
    const dialogContent = document.querySelector('app-dialog > div') as HTMLElement | null;
    if (dialogContent && this.handleKeyDown) {
      dialogContent.removeEventListener('keydown', this.handleKeyDown);
    }
  }

  private focusCloseButton() {
    const buttonElement = this.closeButtonRef?.nativeElement?.querySelector('button');
    if (buttonElement) {
      buttonElement.focus();
    }
  }

  private setupFocusTrap() {
    const dialogContent = document.querySelector('app-dialog > div') as HTMLElement | null;
    if (!dialogContent) return;

    const getFocusableElements = (): HTMLElement[] => {
      const elements = dialogContent.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;
      return Array.from(elements);
    };

    this.handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement;

      if (!dialogContent.contains(activeElement)) {
        e.preventDefault();
        if (e.shiftKey) {
          lastElement.focus();
        } else {
          firstElement.focus();
        }
        return;
      }

      if (e.shiftKey) {
        if (activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', this.handleKeyDown);
  }
}