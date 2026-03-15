import type { Artifact } from '@/definitions';
import { EditArtifactButton } from './EditArtifactButton';

export function ArtefactCard({
  artifact,
  isSelf,
}: {
  artifact: Artifact;
  isSelf: boolean;
}) {
  const { artifactId, publishedAt, title } = artifact;

  return (
    <div key={artifactId} className="bg-surface relative p-4 md:rounded-xl">
      <div>{publishedAt}</div>
      <div>{title}</div>

      {isSelf && (
        <div className="text-foreground-secondary absolute top-2 right-2">
          <EditArtifactButton artifact={artifact} />
        </div>
      )}
    </div>
  );
}
