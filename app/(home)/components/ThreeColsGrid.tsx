import { ReactNode } from 'react';
import { clsx } from '@hanlogy/react-web-ui';

export function ThreeColsGrid({ children }: { children: ReactNode }) {
  return (
    <div
      className={clsx(
        'mx-auto max-w-5xl place-items-center items-stretch gap-6',
        'grid grid-cols-1',
        'lg:grid-cols-3'
      )}
    >
      {children}
    </div>
  );
}
