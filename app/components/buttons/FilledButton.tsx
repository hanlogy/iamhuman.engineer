import { PropsWithChildren } from 'react';
import { Button, ButtonProps } from '@hanlogy/react-web-ui';

export function FilledButton({
  children,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <Button
      className="bg-accent text-on-accent min-w-50"
      size="medium"
      {...props}
    >
      {children}
    </Button>
  );
}
