import type { Artifact, ArtifactTag, Profile } from '@/definitions';
import { ArtifactByTagHelper } from '@/dynamodb/ArtifactByTagHelper';
import { ArtifactHelper } from '@/dynamodb/ArtifactHelper';
import { tagIdsToLabels } from '@/helpers/tagIdsToLabels';
import { ArtifactCard } from './ArtifactCard';
import { ArtifactCardExpander } from './ArtifactCardExpander';

export async function ArtifactList({
  selectedTag,
  tags,
  profile: { userId },
  isSelf,
}: {
  selectedTag?: ArtifactTag | undefined;
  tags: ArtifactTag[];
  profile: Profile;
  isSelf: boolean;
}) {
  const artifacts = await (async () => {
    let artifacts: Artifact[];

    if (selectedTag) {
      const byTagHelper = new ArtifactByTagHelper();
      artifacts = await byTagHelper.getItems({
        userId,
        artifactTagId: selectedTag.artifactTagId,
      });
    } else {
      const artifactHelper = new ArtifactHelper();
      artifacts = await artifactHelper.getItems({ userId });
    }

    return artifacts.map(({ tags: tagIds, ...rest }) => {
      const tagLabels = tagIdsToLabels(tagIds, tags);

      return { ...rest, tags: tagLabels };
    });
  })();

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
