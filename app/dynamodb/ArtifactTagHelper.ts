import { asKey } from '@hanlogy/ts-dynamodb';
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
    newTagLabels: readonly string[],
    oldTagIds: readonly string[] = []
  ): Promise<ResolveTagsResult> {
    const put: ResolveTagsResult['put'] = [];
    const update: ResolveTagsResult['update'] = [];
    const keys = new Set<string>();
    const resolvedTags: Array<{
      tag: ArtifactTagEntity;
      isExisting: boolean;
    }> = [];

    for (let tagLabel of newTagLabels) {
      tagLabel = tagLabel.trim();

      if (!tagLabel) {
        continue;
      }

      const key = asKey(tagLabel);

      if (keys.has(key)) {
        continue;
      }

      keys.add(key);

      const existingTag = await this.get({ userId, key });

      if (existingTag) {
        // Changed: keep whether this tag already exists in db
        resolvedTags.push({
          tag: existingTag,
          isExisting: true,
        });
        continue;
      }

      const artifactTagId = randomUUID();

      // Changed: create in-memory new tag only, do not write here
      resolvedTags.push({
        tag: {
          ...this.buildKeys({ userId, key }),
          ...this.buildGsi1Keys({ userId, artifactTagId }),
          artifactTagId,
          userId,
          key,
          label: tagLabel,
          count: 0,
        },
        isExisting: false,
      });
    }

    const tagIds = resolvedTags.map(({ tag }) => {
      return tag.artifactTagId;
    });

    const {
      add: addedTagIds,
      delete: removedTagIds,
      untouched: untouchedTagIds,
    } = diffArtifactIds(oldTagIds, tagIds);

    const addedTagIdSet = new Set(addedTagIds);
    const removedTagIdSet = new Set(removedTagIds);
    const untouchedTagIdSet = new Set(untouchedTagIds);

    for (const { tag, isExisting } of resolvedTags) {
      if (untouchedTagIdSet.has(tag.artifactTagId)) {
        continue;
      }

      if (!addedTagIdSet.has(tag.artifactTagId)) {
        continue;
      }

      if (!isExisting) {
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

    for (const artifactTagId of removedTagIdSet) {
      const tag = await this.getByTagId({ userId, artifactTagId });

      if (!tag) {
        continue;
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

  async buildDecreaseCountItems({
    userId,
    artifactTagIds,
  }: {
    userId: string;
    artifactTagIds: readonly string[];
  }): Promise<ResolveTagsResult['update']> {
    const update: ResolveTagsResult['update'] = [];
    const seen = new Set<string>();

    for (const artifactTagId of artifactTagIds) {
      if (seen.has(artifactTagId)) {
        continue;
      }

      seen.add(artifactTagId);

      const tag = await this.getByTagId({ userId, artifactTagId });

      if (!tag) {
        continue;
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

    return update;
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
