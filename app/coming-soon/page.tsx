import { GIT_HUB_URL } from '@/definitions';

export default function ComingSoonPage() {
  return (
    <>
      <div className="flex-center flex-col px-4 py-12">
        <div className="text-foreground-muted text-3xl">Coming soon...</div>
        <div className="text-foreground-secondary mt-8 text-center text-lg leading-relaxed">
          Please follow our
          <a
            className="text-accent px-2 font-bold underline"
            href={GIT_HUB_URL}
            target="_blank"
          >
            GitHub
          </a>
          for the latest updates.
        </div>
      </div>
    </>
  );
}
