import { LinkButton } from '@/app/components/LinkButton';

export function Hero() {
  return (
    <div className="px-4 py-12 text-center">
      <h1 className="mb-12 text-4xl font-semibold">
        We are the engineers who ship
      </h1>
      <p className="text-foreground-secondary mb-12">
        No feed, no hot takes. Just our real work: PRs, shipped products,
        packages, talks, and case studies.
      </p>
      <div className="mx-auto flex max-w-60 flex-col items-center justify-center space-y-4">
        <LinkButton style="filled" href="/coming-soon">
          Create profile
        </LinkButton>
        <LinkButton style="outlined" href="/coming-soon">
          Browse engineers
        </LinkButton>
      </div>
    </div>
  );
}
