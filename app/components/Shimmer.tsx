import { clsx } from '@hanlogy/react-web-ui';

export function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-md bg-gray-200',
        className
      )}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}
