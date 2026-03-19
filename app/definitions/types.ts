import { ARTIFACT_TYPES } from './constants';

export interface Session {
  readonly sessionId: string;
  readonly userId: string;
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
}

export interface SessionPayload {
  readonly sessionId: string;
  /**
   * Unix timestamp in seconds
   */
  readonly expiresAt: number;
  /**
   * User summary
   */
  readonly user: Readonly<{
    userId: string;
    handle: string;
    avatar?: string;
  }>;
}

export type UserSummary = SessionPayload['user'];

export type S3Folder = 'profiles' | 'artifacts';

export interface Profile {
  readonly userId: string;
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
  readonly url: string;
  readonly text?: string;
}

export interface Artifact {
  readonly artifactId: string;
  readonly title: string;
  readonly type: ArtifactType;
  readonly tags: readonly string[];
  readonly releaseDate: string;
  readonly summary?: string;
  readonly links: readonly ArtifactLink[];
  readonly judgment?: string;
  readonly userId: string;
  readonly image?: string;
}

export interface ArtifactTag {
  readonly artifactTagId: string;
  readonly key: string;
  readonly label: string;
  readonly count: number;
}
