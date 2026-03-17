import type { Artifact } from '@/definitions';
import { ActionsButton } from './ActionsButton';

export function ArtifactCard({
  artifact,
  isSelf,
}: {
  artifact: Artifact;
  isSelf: boolean;
}) {
  const { artifactId, releaseDate, title } = artifact;

  return (
    <div key={artifactId} className="bg-surface relative p-4 md:rounded-xl">
      <div>{releaseDate}</div>
      <div>{title}</div>

      {isSelf && (
        <div className="text-foreground-secondary absolute top-2 right-2">
          <ActionsButton artifact={artifact} />
        </div>
      )}
    </div>
  );
}
