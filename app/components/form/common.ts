import { clsx } from '@hanlogy/react-web-ui';

export const labelClass = 'text-foreground-secondary';
export const helperClass = 'text-foreground-muted';
export const errorClass = 'text-danger';
export const inputClass = ({ isError }: { isError?: boolean }={}) => {
  return clsx('border rounded-xl focus-within:ring-2 focus-within:ring-inset', {
    'bg-danger/10 border-red-300 focus-within:ring-danger/60': isError,
    'bg-surface-secondary border-border focus-within:ring-accent/60': !isError,
  });
};

export const fieldClassNameBuilders = {
  labelClass,
  helperClass,
  errorClass,
  inputClass,
};
