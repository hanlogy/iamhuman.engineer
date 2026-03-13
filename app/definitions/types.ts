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

export interface Artifact {
  readonly artifactId: string;
  readonly title: string;
  readonly type: ArtifactType;
  readonly tags: string[];
  readonly shipped: string;
  readonly summary: string;
  readonly links: {
    readonly id: string;
    readonly title: string;
    readonly url: string;
  }[];
  readonly judgment: string;
}
