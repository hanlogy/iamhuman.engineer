'use server';

import type { Artifact } from '@/definitions/types';

export async function saveArtifact(
  id: string | undefined,
  attributes: Omit<Artifact, 'artifactId'>
) {
}
