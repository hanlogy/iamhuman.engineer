import { type ReactNode } from 'react';
import { clsx } from '@hanlogy/react-web-ui';
import Link from 'next/link';

export function LinkButton({
  children,
  style,
  href,
}: {
  children: ReactNode;
  style: 'filled' | 'outlined';
  href: string;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        'flex-center h-13 w-full items-center rounded-full font-semibold',
        {
          'bg-accent text-on-accent': style === 'filled',
          'border-border bg-surface-secondary border': style === 'outlined',
        }
      )}
    >
      {children}
    </Link>
  );
}
