import { clsx } from '@hanlogy/react-web-ui';
import { ARTIFACT_TYPES } from '@/definitions';
import { artifactTypeToLabel } from '@/helpers/artifactTypeToLabel';

export default function EngineersPage() {
  const className =
    'border-border bg-surface-secondary h-12 rounded-lg border px-2 w-full sm:w-auto';

  return (
    <div className="py-12">
      <div className="mx-auto flex max-w-xs flex-col items-center space-y-2 px-4 sm:max-w-lg sm:flex-row sm:space-y-0 sm:space-x-2">
        <input
          className={clsx(className, 'sm:flex-1')}
          placeholder="keywords"
        />
        <select
          className={clsx(
            className,
            'text-foreground-secondary pr-4 text-sm sm:text-base'
          )}
        >
          <option value="">All types</option>
          {ARTIFACT_TYPES.map((label) => {
            return (
              <option value={label} key={label}>
                {artifactTypeToLabel(label)}
              </option>
            );
          })}
        </select>
      </div>
      <div className="mt-12 text-center">
        <div className="text-foreground-muted text-xl italic">
          Coming soon...
        </div>
      </div>
    </div>
  );
}
