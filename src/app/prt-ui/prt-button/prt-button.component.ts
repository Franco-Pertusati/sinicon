import { Component, input, output, computed, signal } from '@angular/core';
import { PRT_BUTTON_VARIANTS } from './prt-button-variants';
import { SpinnerComponent } from "../spinner/spinner.component";

@Component({
  selector: 'prt-button',
  standalone: true,
  templateUrl: './prt-button.component.html',
  styleUrl: './prt-button.component.css',
  imports: [SpinnerComponent],
})
export class PrtButton {
  // ─── Outputs ────────────────────────────────────────────────────────────────
  btnClick = output<void>();

  // ─── Inputs: Variant & Style ────────────────────────────────────────────────
  variant   = input<'default' | 'outlined' | 'secondary' | 'ghost' | 'destructive' | 'primary'>('default');
  classList = input<string>('');

  // ─── Inputs: Content ────────────────────────────────────────────────────────
  label     = input<string>('');
  showLabel = input<boolean>(true);

  icon         = input<string>('');
  showIcon     = input<boolean>(true);
  iconPosition = input<'left' | 'right'>('left');

  /** Icono que aparece sólo en hover — no ocupa espacio en reposo */
  hoverIcon = input<string>('');

  // ─── Inputs: Tooltip ────────────────────────────────────────────────────────
  tooltip         = input<string>('');
  tooltipPosition = input<'top' | 'bottom' | 'left' | 'right'>('top');

  // ─── Inputs: State ──────────────────────────────────────────────────────────
  disabled = input<boolean>(false);
  loading  = input<boolean>(false);

  // ─── Inputs: Accessibility ──────────────────────────────────────────────────
  ariaLabel       = input<string>('');
  ariaDescribedBy = input<string>('');

  // ─── Internal state ─────────────────────────────────────────────────────────
  isHovered = signal(false);

  // ─── Computed ───────────────────────────────────────────────────────────────

  /**
   * Si la label está oculta (ej: sidebar colapsada), usa la label como tooltip fallback.
   * El tooltip explícito siempre tiene prioridad.
   */
  effectiveTooltip = computed(() => {
    if (this.tooltip()) return this.tooltip();
    if (!this.showLabel() && this.label()) return this.label();
    return '';
  });

  classes = computed(() => {
    const base = 'prt-btn inline-flex items-center justify-center gap-1.5 rounded-xl font-medium cursor-pointer';
    const variant = PRT_BUTTON_VARIANTS[this.variant()] ?? '';

    const hasLabel        = this.showLabel() && !!this.label();
    const defaultPadding  = hasLabel ? 'px-3 py-1.5' : 'p-1.5';
    const hasPaddingClass = /\b(p|px|py|pt|pb|pl|pr)-/.test(this.classList());
    const padding         = hasPaddingClass ? '' : defaultPadding;

    const direction = this.iconPosition() === 'right' ? 'flex-row-reverse' : 'flex-row';

    const disabledClasses = this.disabled() || this.loading()
      ? 'opacity-50 cursor-not-allowed pointer-events-none'
      : '';

    return `${base} ${direction} ${variant} ${padding} ${this.classList()} ${disabledClasses}`.trim();
  });

  tooltipClasses = computed(() => {
    const positionMap: Record<string, string> = {
      top:    'tooltip-top',
      bottom: 'tooltip-bottom',
      left:   'tooltip-left',
      right:  'tooltip-right',
    };
    return `prt-tooltip bg-dark shadow border border-border rounded-full ${positionMap[this.tooltipPosition()] ?? 'tooltip-top'}`;
  });

  computedAriaLabel = computed(() => this.ariaLabel() || this.label() || undefined);

  // ─── Methods ────────────────────────────────────────────────────────────────

  handleClick(): void {
    if (this.disabled() || this.loading()) return;
    this.btnClick.emit();
  }

  onMouseEnter(): void { this.isHovered.set(true); }
  onMouseLeave(): void { this.isHovered.set(false); }
}