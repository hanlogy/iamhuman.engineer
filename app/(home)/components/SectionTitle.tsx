import type { PropsWithChildren } from 'react';
import { clsx } from '@hanlogy/react-web-ui';

export function SectionTitle({ children }: PropsWithChildren) {
  return (
    <h2
      className={clsx(
        'text-center text-3xl font-semibold',
        'mb-10',
        'sm:mb-16',
        'md:mb-20 md:text-4xl'
      )}
    >
      {children}
    </h2>
  );
}
