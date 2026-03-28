import { NgStyle } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  effect,
  input,
  model,
  output,
  signal,
} from '@angular/core';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface RadioOption {
  /** Unique identifier used as the bound value */
  value: string;
  /** Display text shown inside the label */
  label: string;
  /** Optional label override when the option is selected */
  labelChecked?: string;
  /** Default icon (Material Symbols name) */
  icon?: string;
  /** Icon override when the option is selected */
  iconChecked?: string;
  /** Icon override when the option is NOT selected */
  iconUnchecked?: string;
  /** Disables interaction when true */
  disabled?: boolean;
}

/** Sizes available for text and icon scaling */
type RadioSize = 'sm' | 'md' | 'lg';

// ─────────────────────────────────────────────
// Size maps (defined once, shared across helpers)
// ─────────────────────────────────────────────

const ICON_SIZE_MAP: Record<RadioSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const LABEL_SIZE_MAP: Record<RadioSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

/**
 * `prt-radio` – Accessible radio-group with an animated sliding indicator.
 *
 * ### Basic usage
 * ```html
 * <prt-radio
 *   [options]="myOptions"
 *   [(selectedValue)]="selected"
 *   (selectionChange)="onChanged($event)"
 * />
 * ```
 *
 * ### Inputs
 * | Input               | Type          | Default            | Description                                    |
 * |---------------------|---------------|--------------------|------------------------------------------------|
 * | `options`           | RadioOption[] | **required**       | List of selectable options                     |
 * | `selectedValue`     | string        | `''`               | Two-way bound selected value                   |
 * | `containerClasses`  | string        | `'inline-flex'`    | Tailwind classes applied to the host container |
 * | `indicatorClass`    | string        | `'bg-text'`        | Classes applied to the sliding indicator       |
 * | `selectedOptionClass` | string      | `''`               | Extra classes applied only to the selected label |
 * | `size`              | RadioSize     | `'md'`             | Controls icon and label text size              |
 * | `showIcon`          | boolean       | `true`             | Whether to render option icons                 |
 * | `showLabel`         | boolean       | `true`             | Whether to render option labels                |
 */
@Component({
  selector: 'prt-radio',
  imports: [NgStyle],
  templateUrl: './prt-radio.component.html',
  styles: [`
    :host { display: contents; }

    .sliding-indicator {
      position: absolute;
      border-radius: 0.75rem;
      pointer-events: none;
      z-index: 0;
      transition:
        left   0.25s cubic-bezier(0.4, 0, 0.2, 1),
        top    0.25s cubic-bezier(0.4, 0, 0.2, 1),
        width  0.25s cubic-bezier(0.4, 0, 0.2, 1),
        height 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    label { position: relative; z-index: 1; }
  `],
})
export class PrtRadioComponent implements AfterViewInit {

  // ── Required ──────────────────────────────
  options = input.required<RadioOption[]>();

  // ── Optional inputs ───────────────────────
  containerClasses  = input<string>('inline-flex');
  indicatorClass    = input<string>('bg-neutral');
  /** Extra Tailwind / CSS classes added to the currently selected option label */
  selectedOptionClass = input<string>('');
  size              = input<RadioSize>('md');
  showIcon          = input<boolean>(true);
  showLabel         = input<boolean>(true);

  // ── Two-way binding ───────────────────────
  selectedValue = model<string>('');

  // ── Outputs ───────────────────────────────
  selectionChange = output<string>();

  // ── Internal ──────────────────────────────
  @ViewChildren('optionLabel') private optionLabels!: QueryList<ElementRef<HTMLLabelElement>>;

  slidingStyle = signal<Record<string, string> | null>(null);

  private initialized = false;

  constructor() {
    // Move indicator whenever the selected value changes (after first render)
    effect(() => {
      const value = this.selectedValue();
      if (this.initialized) this.updateSlidingIndicator(value);
    });
  }

  // ─────────────────────────────────────────
  // Lifecycle
  // ─────────────────────────────────────────

  ngAfterViewInit(): void {
    // Wait one tick so the browser has completed layout
    setTimeout(() => {
      this.initialized = true;
      this.updateSlidingIndicator(this.selectedValue(), false);
    }, 0);

    // Re-position when options list changes dynamically
    this.optionLabels.changes.subscribe(() =>
      this.updateSlidingIndicator(this.selectedValue(), false)
    );
  }

  // ─────────────────────────────────────────
  // Public helpers (used in the template)
  // ─────────────────────────────────────────

  onSelect(option: RadioOption): void {
    if (option.disabled) return;
    this.selectedValue.set(option.value);
    this.selectionChange.emit(option.value);
  }

  getOptionClasses(option: RadioOption): string {
    const isSelected = this.selectedValue() === option.value;
    const iconOnly   = !this.showLabel() || !option.label;

    return [
      'inline-flex items-center justify-center gap-1.5 rounded-xl font-medium cursor-pointer select-none',
      iconOnly ? 'p-1.5' : 'px-3 py-1.5',
      option.disabled ? 'opacity-50 cursor-not-allowed' : '',
      isSelected ? this.selectedOptionClass() : '',
    ].filter(Boolean).join(' ');
  }

  getIconClasses(): string {
    return `flex items-center justify-center rounded ${ICON_SIZE_MAP[this.size()]}`;
  }

  getLabelClasses(option: RadioOption): string {
    const isSelected = this.selectedValue() === option.value;
    return `${LABEL_SIZE_MAP[this.size()]} ${isSelected ? 'font-medium' : ''}`.trim();
  }

  /** Returns the icon name to display, respecting checked/unchecked overrides */
  getDisplayIcon(option: RadioOption): string | undefined {
    const isSelected = this.selectedValue() === option.value;
    if (isSelected && option.iconChecked)   return option.iconChecked;
    if (!isSelected && option.iconUnchecked) return option.iconUnchecked;
    return option.icon;
  }

  /** Returns the label text, using `labelChecked` when the option is active */
  getDisplayLabel(option: RadioOption): string {
    const isSelected = this.selectedValue() === option.value;
    return isSelected && option.labelChecked ? option.labelChecked : option.label;
  }

  // ─────────────────────────────────────────
  // Private helpers
  // ─────────────────────────────────────────

  /**
   * Calculates and sets the absolute position/size of the sliding indicator
   * to sit behind the currently selected label.
   *
   * @param value    - The value of the option to highlight
   * @param animate  - When false the transition is suppressed (e.g. on init)
   */
  private updateSlidingIndicator(value: string, animate = true): void {
    const selectedLabel = this.optionLabels?.find(
      (el) => el.nativeElement.getAttribute('data-value') === value
    );

    if (!selectedLabel) {
      this.slidingStyle.set(null);
      return;
    }

    const labelEl  = selectedLabel.nativeElement;
    const parentEl = labelEl.parentElement;
    if (!parentEl) return;

    const parentRect = parentEl.getBoundingClientRect();
    const labelRect  = labelEl.getBoundingClientRect();

    this.slidingStyle.set({
      left:   `${labelRect.left  - parentRect.left}px`,
      top:    `${labelRect.top   - parentRect.top}px`,
      width:  `${labelRect.width}px`,
      height: `${labelRect.height}px`,
      ...(animate ? {} : { transition: 'none' }),
    });

    // Re-enable transitions on the next paint after a no-animate update
    if (!animate) {
      requestAnimationFrame(() =>
        this.slidingStyle.update((s) => s ? { ...s, transition: '' } : s)
      );
    }
  }
}