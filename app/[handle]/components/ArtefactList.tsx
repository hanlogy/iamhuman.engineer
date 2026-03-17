import type { ArtifactTag, Profile } from '@/definitions';
import { ArtifactHelper } from '@/dynamodb/ArtifactHelper';
import { tagIdsToLabels } from '@/helpers/tagIdsToLabels';
import { ArtefactCard } from './ArtefactCard';

export async function ArtefactList({
  tags,
  profile: { userId },
  isSelf,
}: {
  tags: ArtifactTag[];
  profile: Profile;
  isSelf: boolean;
}) {
  const artifactHelper = new ArtifactHelper();
  const artifacts = (await artifactHelper.getItems({ userId })).map(
    ({ tags: tagIds, ...rest }) => {
      const tagLabels = tagIdsToLabels(tagIds, tags);

      return { ...rest, tags: tagLabels };
    }
  );

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
          <ArtefactCard isSelf={isSelf} artifact={artifact} key={artifactId} />
        );
      })}
    </div>
  );
}
