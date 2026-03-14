import { ARTIFACT_TYPES } from './constants';

export type S3Folder = 'profiles' | 'artifacts';

export interface Profile {
  readonly handle: string;
  readonly status?: string;
  readonly avatar?: string;
  readonly name?: string;
  readonly location?: string;
  readonly region?: string;
  readonly language?: string;
  readonly links?: string[];
}

export type ArtifactType = (typeof ARTIFACT_TYPES)[number];

export interface ArtifactLink {
  readonly title: string;
  readonly url: string;
}

export interface Artifact {
  readonly artifactId: string;
  readonly title: string;
  readonly type: ArtifactType;
  readonly tags: string[];
  readonly publishedAt: string;
  readonly summary?: string;
  readonly links: ArtifactLink[];
  readonly judgment?: string;
}

export interface ArtifactTag {
  readonly artifactTagId: string;
  readonly key: string;
  readonly label: string;
  readonly count: number;
}
