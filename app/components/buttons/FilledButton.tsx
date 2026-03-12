import { type PropsWithChildren } from 'react';
import { Button, type ButtonProps } from '@hanlogy/react-web-ui';

export function FilledButton({
  children,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <Button
      className="bg-accent text-on-accent w-full"
      size="medium"
      {...props}
    >
      {children}
    </Button>
  );
}
