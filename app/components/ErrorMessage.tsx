import { clsx } from '@hanlogy/react-web-ui';

export function ErrorMessage({
  message,
  className,
}: {
  message: string | null | undefined;
  className?: string;
}) {
  if (!message) {
    return;
  }

  return (
    <div className={clsx('text-danger text-center', className)}>{message}</div>
  );
}
