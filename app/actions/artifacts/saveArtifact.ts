'use server';

import {
  toActionFailure,
  toActionSuccess,
  type ActionResponse,
} from '@hanlogy/react-kit';
import { USER_ID_KEY } from '@/definitions';
import type { Artifact } from '@/definitions/types';
import { ArtifactHelper } from '@/dynamodb/ArtifactHelper';
import { createCookieHelper } from '@/server/createCookieHelper';

export async function saveArtifact(
  id: string | undefined,
  attributes: Omit<Artifact, 'artifactId' | 'tags'> & {
    tagLabels: string[];
  }
): Promise<ActionResponse> {
  const artifactHelper = new ArtifactHelper();
  const { getCookie } = await createCookieHelper();
  const userId = getCookie(USER_ID_KEY);

  if (!userId) {
    return toActionFailure();
  }

  try {
    if (!id) {
      await artifactHelper.createItem({ userId, ...attributes });
    } else {
      //
    }
    return toActionSuccess();
  } catch {
    return toActionFailure();
  }
}
