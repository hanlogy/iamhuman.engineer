import { ARTIFACT_TYPES } from './constants';

export interface Profile {
  readonly handle: string;
  readonly status?: string;
  readonly avatar?: string;
  readonly name?: string;
  readonly region?: string;
  readonly language?: string;
}

export type ArtifactType = (typeof ARTIFACT_TYPES)[number];
