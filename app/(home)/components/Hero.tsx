import { clsx } from '@hanlogy/react-web-ui';
import { LinkButton } from '@/app/components/LinkButton';
import { EngineersCounter } from './EngineersCounter';

export function Hero() {
  return (
    <div className="px-4 text-center sm:px-6">
      <h1
        className={clsx(
          'leading-tight font-semibold',
          'mb-12 text-4xl',
          'sm:mb-14 sm:text-[2.5em]',
          'md:mb-16 md:text-5xl'
        )}
      >
        We are the engineers who ship
      </h1>
      <p
        className={clsx(
          'text-foreground-secondary mx-auto max-w-2xl',
          'mb-12',
          'sm:mb-16 sm:text-lg',
          'md:text-xl'
        )}
      >
        No feed, no hot takes. Just our real work: PRs, shipped products,
        packages, talks, and case studies.
      </p>
      <div
        className={clsx(
          'mx-auto flex',
          'items-center justify-center',
          'max-w-60 flex-col space-y-4',
          'md:max-w-md md:flex-row md:space-y-0 md:space-x-4'
        )}
      >
        <LinkButton style="filled" href="/coming-soon">
          Create profile
        </LinkButton>
        <LinkButton style="outlined" href="/coming-soon">
          Browse engineers
        </LinkButton>
      </div>
      <EngineersCounter />
    </div>
  );
}
