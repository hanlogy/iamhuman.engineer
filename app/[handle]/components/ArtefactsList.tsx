import type { ArtifactTag, Profile } from '@/definitions';
import { ArtifactHelper } from '@/dynamodb/ArtifactHelper';
import { getUserFromCookie } from '@/server/userInCookie';
import { ArtefactCard } from './ArtefactCard';

export async function ArtefactsList({
  tags,
  profile: { userId },
}: {
  tags: ArtifactTag[];
  profile: Profile;
}) {
  const { userId: myUserId } = (await getUserFromCookie()) ?? {};
  const isSelf = myUserId === userId;
  const artifactHelper = new ArtifactHelper();
  const artifacts = await artifactHelper.getItems({ userId });

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
    <div>
      {artifacts.map((artifact) => {
        const { artifactId } = artifact;

        return (
          <ArtefactCard isSelf={isSelf} artifact={artifact} key={artifactId} />
        );
      })}
    </div>
  );
}
