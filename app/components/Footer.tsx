import { GitHubIcon } from './icons';

export function Footer() {
  return (
    <footer className="px-4 py-4 text-center sm:py-8">
      <div className="text-foreground-secondary text-sm font-semibold italic md:text-base">
        A companion to GitHub, LinkedIn, your personal site and more. Not a
        replacement
      </div>
      <div className="text-foreground-muted flex-center mt-4 flex-col text-center text-sm">
        © 2026 IAmHuman.Engineer
        <a
          className="mt-2"
          href="https://github.com/hanlogy/iamhuman.engineer"
          target="_blank"
        >
          <GitHubIcon className="w-6" />
        </a>
      </div>
    </footer>
  );
}
