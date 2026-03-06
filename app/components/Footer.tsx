import { gitHubUrl } from '../definitions/constants';
import { GitHubSvg } from './svgs';

export function Footer() {
  return (
    <footer className="px-4 py-4 text-center sm:py-8">
      <div className="text-foreground-muted flex-center flex-col text-center text-sm">
        © 2026 IAmHuman.Engineer
        <a className="mt-2" href={gitHubUrl} target="_blank">
          <GitHubSvg className="w-6" />
        </a>
      </div>
    </footer>
  );
}
