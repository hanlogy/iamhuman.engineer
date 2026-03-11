import type { MouseEventHandler, PropsWithChildren } from 'react';
import Link from 'next/link';

type Href = string | undefined | null;

export function LinkOrButton({
  children,
  className,
  href,
  onClick,
}: PropsWithChildren<{
  className?: string;
  href?: (() => void | Href) | Href;
  onClick?: MouseEventHandler;
}>) {
  const resolvedHref = typeof href === 'function' ? href() : href;

  if (resolvedHref) {
    return (
      <Link onClick={onClick} href={resolvedHref} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}
