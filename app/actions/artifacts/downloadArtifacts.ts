'use server';

import {
  toActionFailure,
  toActionSuccess,
  type ActionResponse,
} from '@hanlogy/react-kit';
import { getProfile } from '@/actions/profile/getProfile';
import { ArtifactHelper } from '@/dynamodb/ArtifactHelper';
import { UserHelper } from '@/dynamodb/UserHelper';
import { tagIdsToLabels } from '@/helpers/tagIdsToLabels';
import { renderArtifactsPdf } from '@/server/artifactsPdfBuilder';
import { getCachedArtifactTags } from './getArtifactTags';

export async function downloadArtifacts({
  userId,
  artifactIds,
  format,
}: {
  userId: string;
  artifactIds: string[];
  format: 'pdf' | 'json';
}): Promise<ActionResponse<string>> {
  const helper = new ArtifactHelper();

  const [rawArtifacts, tagsResult, userRecord] = await Promise.all([
    Promise.all(
      artifactIds.map((artifactId) => helper.getItem({ artifactId }))
    ),
    getCachedArtifactTags({ userId }),
    new UserHelper().get(userId),
  ]);

  const tags = tagsResult.success ? tagsResult.data : [];

  const artifacts = rawArtifacts
    .filter(
      (a): a is NonNullable<typeof a> => a !== undefined && a.userId === userId
    )
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
    .map(({ tags: tagIds, ...rest }) => ({
      ...rest,
      tags: tagIdsToLabels(tagIds, tags),
    }));

  const excluded = new Set(['artifactId', 'userId', 'createdAt', 'updatedAt']);

  const handle = userRecord?.handle as string | undefined;
  const profileResult = handle ? await getProfile({ handle }) : undefined;
  const profileName = profileResult?.success
    ? profileResult.data.name
    : undefined;

  if (format === 'json') {
    const cleanArtifacts = artifacts.map((a) => {
      const obj: Record<string, unknown> = { ...a };
      for (const key of excluded) {
        delete obj[key];
      }
      return obj;
    });
    const output: Record<string, unknown> = {
      ...(profileName ? { name: profileName } : {}),
      date: new Date().toISOString(),
      artifacts: cleanArtifacts,
    };
    return toActionSuccess(JSON.stringify(output, null, 2));
  }

  if (format === 'pdf') {
    const buffer = await renderArtifactsPdf(artifacts, profileName);
    return toActionSuccess(buffer.toString('base64'));
  }

  return toActionFailure({ code: 'notSupported' });
}
