import type { JsonRecord } from '@hanlogy/ts-lib';
import { randomUUID } from 'crypto';
import type { ArtifactTag } from '@/definitions';
import { HelperBase } from './HelperBase';
import { diffArtifactIds } from './diffArtifactIds';
import type { ArtifactTagEntity, ResolveTagsResult } from './types';

export class ArtifactTagHelper extends HelperBase {
  private entity = 'ARTIFACT_TAG';
  private version = '01';

  private buildPk({ userId }: { userId: string }) {
    return this.db.buildKey(this.entity, userId);
  }

  private buildSk({ key }: { key: string }) {
    return this.db.buildKey(this.version, key, true);
  }

  private buildKeys({ userId, key }: { userId: string; key: string }) {
    return {
      pk: this.buildPk({ userId }),
      sk: this.buildSk({ key }),
    };
  }

  private buildGsi1Pk({
    userId,
    artifactTagId,
  }: {
    userId: string;
    artifactTagId: string;
  }) {
    return this.db.buildKey(this.entity, userId, artifactTagId);
  }

  private buildGsi1Keys({
    userId,
    artifactTagId,
  }: {
    userId: string;
    artifactTagId: string;
  }) {
    return {
      gsi1Pk: this.buildGsi1Pk({ userId, artifactTagId }),
      gsi1Sk: this.db.buildKey(this.version, true),
    };
  }

  private buildTagKey(label: string) {
    return label
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, '-');
  }

  async create({
    userId,
    key,
    label,
  }: Omit<
    ArtifactTagEntity,
    'pk' | 'sk' | 'gsi1Pk' | 'gsi1Sk' | 'artifactTagId' | 'count'
  >): Promise<ArtifactTagEntity> {
    const artifactTagId = randomUUID();

    const item = {
      ...this.buildKeys({ userId, key }),
      ...this.buildGsi1Keys({ userId, artifactTagId }),
      artifactTagId,
      userId,
      key,
      label,
      count: 0,
    };

    await this.db.put({
      keyNames: ['pk', 'sk'],
      item,
    });

    return item;
  }

  async get({
    key,
    userId,
  }: {
    key: string;
    userId: string;
  }): Promise<ArtifactTagEntity | undefined> {
    const { item } = await this.db.get({
      keys: this.buildKeys({ userId, key }),
    });

    if (!item) {
      return undefined;
    }

    return item as ArtifactTagEntity;
  }

  async getByTagId({
    userId,
    artifactTagId,
  }: {
    userId: string;
    artifactTagId: string;
  }): Promise<ArtifactTagEntity | undefined> {
    const { items } = await this.db.query({
      indexName: 'GSI1',
      keyConditions: [
        {
          attribute: 'gsi1Pk',
          value: this.buildGsi1Pk({ userId, artifactTagId }),
        },
      ],
    });

    const item = items[0];

    if (!item) {
      return undefined;
    }

    return item as ArtifactTagEntity;
  }

  async resolveTags(
    userId: string,
    newTagLabels: string[],
    oldTagIds: string[] = []
  ): Promise<ResolveTagsResult> {
    const put: ResolveTagsResult['put'] = [];
    const update: ResolveTagsResult['update'] = [];
    const keys = new Set<string>();
    const resolvedTags: ArtifactTagEntity[] = [];

    for (let tagLabel of newTagLabels) {
      tagLabel = tagLabel.trim();

      if (!tagLabel) {
        continue;
      }

      const key = this.buildTagKey(tagLabel);

      if (keys.has(key)) {
        continue;
      }

      keys.add(key);

      let tag = await this.get({ userId, key });

      if (!tag) {
        const artifactTagId = randomUUID();

        tag = {
          ...this.buildKeys({ userId, key }),
          ...this.buildGsi1Keys({ userId, artifactTagId }),
          artifactTagId,
          userId,
          key,
          label: tagLabel,
          count: 0,
        };
      }

      resolvedTags.push(tag);
    }

    const tagIds = resolvedTags.map(({ artifactTagId }) => artifactTagId);

    const { add: addedTagIds, delete: removedTagIds } = diffArtifactIds(
      oldTagIds,
      tagIds
    );
    const addedTagIdSet = new Set(addedTagIds);

    for (const tag of resolvedTags) {
      if (!addedTagIdSet.has(tag.artifactTagId)) {
        continue;
      }

      if (tag.count === 0) {
        put.push({
          keyNames: ['pk', 'sk'],
          item: {
            ...tag,
            count: 1,
          },
        });
        continue;
      }

      update.push({
        keys: {
          pk: tag.pk,
          sk: tag.sk,
        },
        setAttributes: {
          count: tag.count + 1,
        },
      });
    }

    for (const artifactTagId of removedTagIds) {
      const tag = await this.getByTagId({ userId, artifactTagId });

      if (!tag) {
        throw new Error(`Tag not found: ${artifactTagId}`);
      }

      update.push({
        keys: {
          pk: tag.pk,
          sk: tag.sk,
        },
        setAttributes: {
          count: Math.max(tag.count - 1, 0),
        },
      });
    }

    return { tagIds, put, update };
  }

  async getTags({ userId }: { userId: string }): Promise<ArtifactTag[]> {
    const { items } = await this.db.query({
      keyConditions: [
        {
          attribute: 'pk',
          value: this.buildPk({ userId }),
        },
      ],
    });

    return items.map(this.buildArtifactTagEntity);
  }

  private buildArtifactTagEntity(data: JsonRecord): ArtifactTagEntity {
    const { pk, sk, gsi1Pk, gsi1Sk, userId, artifactTagId, key, label, count } =
      data;

    if (
      typeof pk !== 'string' ||
      typeof sk !== 'string' ||
      typeof gsi1Pk !== 'string' ||
      typeof gsi1Sk !== 'string' ||
      typeof artifactTagId !== 'string' ||
      typeof userId !== 'string' ||
      typeof label !== 'string' ||
      typeof key !== 'string' ||
      typeof count !== 'number'
    ) {
      throw new Error('Unknown error');
    }

    return {
      pk,
      sk,
      gsi1Pk,
      gsi1Sk,
      userId,
      artifactTagId,
      key,
      label,
      count,
    };
  }
}
