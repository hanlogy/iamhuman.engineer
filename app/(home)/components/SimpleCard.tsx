import { ReactNode } from 'react';
import { clsx } from '@hanlogy/react-web-ui';

export function SimpleCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
}) {
  return (
    <div
      className={clsx(
        'bg-surface w-full max-w-lg rounded-xl',
        'px-4 py-8',
        'sm:px-6 sm:py-10'
      )}
    >
      <div className={clsx('text-foreground-muted', 'mb-6', 'sm:mb-8')}>
        {icon}
      </div>
      <h3 className={clsx('text-xl font-semibold', 'mb-4', 'sm:mb-6')}>
        {title}
      </h3>
      <div className="text-foreground-muted">{description}</div>
    </div>
  );
}
