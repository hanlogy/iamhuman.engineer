import type { PutConfig, UpdateConfig } from '@hanlogy/ts-dynamodb';
import type { Artifact, ArtifactTag, Profile } from '@/definitions/types';

export interface ProfileEntity extends Profile {
  readonly pk: string;
  readonly sk: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export class DBHelperError<T> extends Error {
  constructor({
    code,
    message,
    data,
  }: {
    code: string;
    message?: string;
    data?: T;
  }) {
    super(message);
    this.code = code;
    this.data = data;
  }

  readonly code: string;
  readonly data?: T;
  readonly name = 'DBHelperError';
}

export type CreateArtifactParams = Omit<Artifact, 'artifactId' | 'tags'> & {
  userId: string;
  tagLabels: string[];
};

export type UpdateArtifactParams = Omit<Artifact, 'artifactId' | 'tags'> & {
  tagLabels: string[];
};

export interface ArtifactEntity extends Artifact {
  readonly pk: string;
  readonly sk: string;
  readonly gsi1Pk: string;
  readonly gsi1Sk: string;
  readonly gsi2Pk: string;
  readonly gsi2Sk: string;
  readonly gsi3Pk: string;
  readonly gsi3Sk: string;
  readonly userId: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface ArtifactTagEntity extends ArtifactTag {
  readonly pk: string;
  readonly sk: string;
  readonly gsi1Pk: string;
  readonly gsi1Sk: string;
  readonly userId: string;
}

export interface ResolveTagsResult {
  tagIds: string[];
  put: PutConfig<ArtifactTagEntity, 'pk' | 'sk'>[];
  update: UpdateConfig<
    Pick<ArtifactTagEntity, 'count'>,
    Pick<ArtifactTagEntity, 'pk' | 'sk'>
  >[];
}

export type BuildPutItemsParams = Omit<Artifact, 'tags'> & {
  /**
   * tag ids
   */
  readonly tags: readonly string[];
  readonly userId: string;
};
