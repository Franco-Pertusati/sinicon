import { Component, computed, input, model } from '@angular/core';

@Component({
  selector: 'prt-check-box',
  imports: [],
  templateUrl: './prt-check-box.component.html',
})
export class PrtCheckBoxComponent {
  // Content
  label = input<string>('');
  labelChecked = input<string>('');
  iconChecked = input<string>('');
  iconUnchecked = input<string>('');

  // Config
  variant = input<'default' | 'outlined' | 'secondary' | 'ghost'>('default');
  size = input<'sm' | 'md' | 'lg'>('md');
  disabled = input<boolean>(false);
  showIcon = input<boolean>(true);
  showLabel = input<boolean>(true);

  checked = model<boolean>(false);

  // Derived display values
  protected activeIcon = computed(() =>
    this.checked() ? this.iconChecked() : this.iconUnchecked()
  );

  protected activeLabel = computed(() =>
    this.checked() && this.labelChecked() ? this.labelChecked() : this.label()
  );

  protected hasIcon = computed(() =>
    this.showIcon() && !!(this.iconChecked() || this.iconUnchecked())
  );

  protected hasLabel = computed(() =>
    this.showLabel() && !!this.activeLabel()
  );

  protected containerClasses = computed(() => {
    const variantMap: Record<string, string> = {
      default:   this.checked() ? 'bg-text text-dark' : 'bg-dark text-text',
      outlined:  'border border-border hover:bg-neutral',
      secondary: this.checked() ? 'bg-text text-dark' : 'bg-neutral',
      ghost:     'bg-transparent hover:bg-neutral',
    };

    return [
      'inline-flex items-center justify-center gap-1.5 rounded-xl font-medium cursor-pointer select-none',
      this.hasLabel() ? 'px-3 py-1.5' : 'p-1.5',
      this.disabled() ? 'opacity-50 cursor-not-allowed' : '',
      variantMap[this.variant()],
    ].join(' ');
  });

  protected iconClasses = computed(() => {
    const sizeMap = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };
    return `flex items-center justify-center rounded ${sizeMap[this.size()]}`;
  });

  protected labelClasses = computed(() => {
    const sizeMap = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' };
    return `${sizeMap[this.size()]} ${this.checked() ? 'font-medium' : ''}`;
  });

  onToggle(): void {
    if (!this.disabled()) {
      this.checked.update(v => !v);
    }
  }
}