'use server';

import {
  toActionFailure,
  toActionSuccess,
  type ActionResponse,
} from '@hanlogy/react-kit';
import type { Artifact } from '@/definitions/types';
import { ArtifactHelper } from '@/dynamodb/ArtifactHelper';
import { getUserFromCookie } from '@/server/userInCookie';

export async function saveArtifact(
  id: string | undefined,
  attributes: Omit<Artifact, 'artifactId' | 'tags'> & {
    tagLabels: string[];
  }
): Promise<ActionResponse> {
  const artifactHelper = new ArtifactHelper();
  const { userId } = (await getUserFromCookie()) ?? {};

  if (!userId) {
    return toActionFailure();
  }

  try {
    if (!id) {
      await artifactHelper.createItem({ userId, ...attributes });
    } else {
      await artifactHelper.updateItem({ userId, artifactId: id }, attributes);
    }
    return toActionSuccess();
  } catch {
    return toActionFailure();
  }
}
