import { getArtifacts } from '@/actions/artifacts/getArtifacts';
import type { ArtifactTag, Profile } from '@/definitions';
import { ArtifactCard } from './ArtifactCard';
import { ArtifactCardExpander } from './ArtifactCardExpander';

export async function ArtifactList({
  selectedTag,
  profile: { userId },
  isSelf,
}: {
  selectedTag?: ArtifactTag | undefined;
  profile: Profile;
  isSelf: boolean;
}) {
  const result = await getArtifacts({
    userId,
    artifactTagId: selectedTag?.artifactTagId,
  });
  const artifacts = result.success ? result.data : [];

  if (artifacts.length === 0) {
    return (
      <>
        <div className="text-foreground-muted bg-surface-secondary rounded-xl py-16 text-center">
          <div className="md:text-lg">No artifacts yet.</div>
          {isSelf && (
            <div className="mt-2 text-sm md:text-base">
              Add your first piece of work: a PR, a talk, a case study.
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <div className="space-y-6">
      {artifacts.map((artifact) => {
        const { artifactId } = artifact;

        return (
          <ArtifactCardExpander key={artifactId}>
            <ArtifactCard artifact={artifact} isSelf={isSelf} />
          </ArtifactCardExpander>
        );
      })}
    </div>
  );
}
