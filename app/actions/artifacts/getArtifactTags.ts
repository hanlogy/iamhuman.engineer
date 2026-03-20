'use server';

import { cache } from 'react';
import { toActionSuccess, type ActionResponse } from '@hanlogy/react-kit';
import type { ArtifactTag } from '@/definitions';
import { ArtifactTagHelper } from '@/dynamodb/ArtifactTagHelper';

export async function getArtifactTags({
  userId,
}: {
  userId: string;
}): Promise<ActionResponse<ArtifactTag[]>> {
  const tagHelper = new ArtifactTagHelper();
  const tags = await tagHelper.getTags({ userId });

  return toActionSuccess(tags);
}

export const getCachedArtifactTags = cache(getArtifactTags);
