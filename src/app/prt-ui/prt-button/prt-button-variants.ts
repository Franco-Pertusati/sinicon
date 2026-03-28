export type PrtButtonVariant = 'default' | 'outlined' | 'secondary' | 'ghost' | 'destructive' | 'primary';

export const PRT_BUTTON_VARIANTS = {
  default: 'bg-text text-dark',
  primary: 'bg-primary text-white',
  outlined: 'border border-border hover:bg-neutral',
  secondary: 'bg-neutral',
  ghost: 'bg-transparent hover:bg-neutral',
  destructive: 'bg-danger text-white',
} as const satisfies Record<PrtButtonVariant, string>;