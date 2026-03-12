import { type PropsWithChildren } from 'react';
import { Button, clsx, type ButtonProps } from '@hanlogy/react-web-ui';

export function FilledButton({
  children,
  className,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <Button className={clsx("bg-accent text-on-accent", className)} size="medium" {...props}>
      {children}
    </Button>
  );
}
