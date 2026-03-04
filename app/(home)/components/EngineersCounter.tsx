import { clsx } from '@hanlogy/react-web-ui';

export function EngineersCounter() {
  return (
    <div
      className={clsx(
        'bg-surface-secondary py-10 text-center',
        'mt-14',
        'sm:mt-20',
        'md:mt-32'
      )}
    >
      <div className="text-foreground-muted text-xl leading-none">
        Total Human Engineers
      </div>
      <div className="mt-8 text-5xl leading-none font-semibold">0</div>
    </div>
  );
}
