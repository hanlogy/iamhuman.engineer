import { randomUUID } from 'crypto';
import type { Artifact, ArtifactType } from '@/definitions/types';
import { ArtifactByTagHelper } from './ArtifactByTagHelper';
import { ArtifactTagHelper } from './ArtifactTagHelper';
import { HelperBase } from './HelperBase';
import type {
  ArtifactEntity,
  CreateArtifactParams,
  UpdateArtifactParams,
} from './types';

export class ArtifactHelper extends HelperBase {
  private entity = 'ARTIFACT';
  private version = '01';

  private buildPk({ userId }: { userId: string }) {
    return this.db.buildKey(this.entity, userId);
  }
  private buildSk({ artifactId }: { artifactId: string }) {
    return this.db.buildKey(this.version, artifactId, true);
  }

  private buildKeys({
    userId,
    artifactId,
  }: {
    userId: string;
    artifactId: string;
  }) {
    return {
      pk: this.buildPk({ userId }),
      sk: this.buildSk({ artifactId }),
    };
  }

  private buildGsi1Pk = this.buildPk;

  private buildGsi1Sk({
    publishedAt,
    artifactId,
  }: {
    publishedAt: string;
    artifactId: string;
  }) {
    return this.db.buildKey(this.version, publishedAt, artifactId, true);
  }

  private buildGsi1Keys({
    userId,
    publishedAt,
    artifactId,
  }: {
    userId: string;
    publishedAt: string;
    artifactId: string;
  }) {
    return {
      gsi1Pk: this.buildGsi1Pk({ userId }),
      gsi1Sk: this.buildGsi1Sk({ publishedAt, artifactId }),
    };
  }

  private buildGsi2Pk({
    userId,
    type,
  }: {
    userId: string;
    type: ArtifactType;
  }) {
    return this.db.buildKey(this.entity, userId, type);
  }

  private buildGsi2Sk = this.buildGsi1Sk;

  private buildGsi2Keys({
    userId,
    type,
    publishedAt,
    artifactId,
  }: {
    userId: string;
    type: ArtifactType;
    publishedAt: string;
    artifactId: string;
  }) {
    return {
      gsi2Pk: this.buildGsi2Pk({ userId, type }),
      gsi2Sk: this.buildGsi2Sk({ publishedAt, artifactId }),
    };
  }

  async get({
    userId,
    artifactId,
  }: {
    userId: string;
    artifactId: string;
  }): Promise<ArtifactEntity | undefined> {
    const { item } = await this.db.get({
      keys: this.buildKeys({
        artifactId,
        userId,
      }),
    });
    if (!item) {
      return undefined;
    }
    return item as ArtifactEntity;
  }

  async createItem({
    title,
    userId,
    publishedAt,
    type,
    summary,
    links,
    judgment,
    tagLabels,
  }: CreateArtifactParams) {
    const artifactId = randomUUID();
    const tagHelper = this.createHelper(ArtifactTagHelper);
    const byTagHelper = this.createHelper(ArtifactByTagHelper);

    const resolvedTags = await tagHelper.resolveTags(userId, tagLabels);

    const commonAttributes = {
      tags: resolvedTags,
      userId,
      type,
      publishedAt,
      artifactId,
      title,
      summary,
      links,
      judgment,
    };

    await this.db.transactWrite({
      put: [
        {
          keyNames: ['pk', 'sk'],
          item: {
            ...this.buildKeys({ userId, artifactId }),
            ...this.buildGsi1Keys({ userId, artifactId, publishedAt }),
            ...this.buildGsi2Keys({ userId, artifactId, type, publishedAt }),
            ...commonAttributes,
          },
        },
        ...resolvedTags.map((artifactTagId) => ({
          keyNames: ['pk', 'sk'],
          item: {
            ...byTagHelper.buildKeys({
              userId,
              artifactId,
              publishedAt,
              artifactTagId,
            }),
            ...commonAttributes,
          },
        })),
      ],
    });
  }

  async updateItem(
    {
      artifactId,
      userId,
    }: {
      userId: string;
      artifactId: string;
    },
    {
      title,
      publishedAt,
      type,
      summary,
      links,
      judgment,
      tagLabels,
    }: UpdateArtifactParams
  ) {
    const item = await this.get({ userId, artifactId });
    if (!item) {
      throw new Error('Unknown error');
    }

    const tagHelper = this.createHelper(ArtifactTagHelper);

    const resolvedTags = await tagHelper.resolveTags(userId, tagLabels);
  }

  async getItems({ userId }: { userId: string }): Promise<Artifact[]> {
    const { items } = await this.db.query({
      indexName: 'GSI1',
      keyConditions: [
        {
          attribute: 'gsi1Pk',
          value: this.buildGsi1Pk({ userId }),
        },
      ],
    });

    return items.map(
      ({
        pk: _pk,
        sk: _sk,
        gsi1Pk: _gsi1Pk,
        gsi1Sk: _gsi1Sk,
        gsi2Pk: _gsi2Pk,
        gsi2Sk: _gsi2Sk,
        ...rest
      }) => rest as Artifact
    );
  }
}
