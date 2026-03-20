import { clsx } from '@hanlogy/react-web-ui';
import { LinkButton } from '@/components/LinkButton';
import { EngineersCounter } from './EngineersCounter';

export function Hero() {
  return (
    <div>
      <div className="px-4 text-center sm:px-6">
        <h1
          className={clsx(
            'leading-tight font-semibold',
            'mb-6 text-4xl',
            'sm:mb-8 sm:text-[2.5em]',
            'md:mb-10 md:text-5xl'
          )}
        >
          We work with intent.
        </h1>
        <p
          className={clsx(
            'text-foreground-secondary mx-auto max-w-2xl leading-relaxed',
            'sm:text-lg',
            'md:text-xl'
          )}
        >
          A quiet place for engineers to document the decisions, tradeoffs, and
          reasoning behind our work. No feed. No likes.
        </p>
        <div className="text-foreground-muted mt-2 text-sm italic sm:mt-4">
          Not anti-AI. Pro craft, proof, and accountability.
        </div>
        <div
          className={clsx(
            'mx-auto flex',
            'items-center justify-center',
            'mt-12 max-w-60 flex-col space-y-4',
            'sm:mt-16',
            'md:mt-18 md:max-w-md md:flex-row md:space-y-0 md:space-x-4'
          )}
        >
          <LinkButton style="filled" href="/signup">
            Create profile
          </LinkButton>
          <LinkButton style="outlined" href="/engineers">
            Browse engineers
          </LinkButton>
        </div>
      </div>
      <EngineersCounter />
    </div>
  );
}
