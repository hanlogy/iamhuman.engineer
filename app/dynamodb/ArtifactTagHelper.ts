import type { JsonRecord } from '@hanlogy/ts-lib';
import { randomUUID } from 'crypto';
import type { ArtifactTag } from '@/definitions';
import { HelperBase } from './HelperBase';
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

  async create({
    userId,
    key,
    label,
  }: Omit<
    ArtifactTagEntity,
    'pk' | 'sk' | 'artifactTagId' | 'count'
  >): Promise<ArtifactTagEntity> {
    const artifactTagId = randomUUID();

    const item = {
      ...this.buildKeys({ userId, key }),
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

  async resolveTags(
    userId: string,
    tagLabels: string[]
  ): Promise<ResolveTagsResult> {
    const put: ResolveTagsResult['put'] = [];
    const update: ResolveTagsResult['update'] = [];
    const keys = new Set<string>();

    for (let tagLabel of tagLabels) {
      tagLabel = tagLabel.trim();

      if (!tagLabel) {
        continue;
      }

      const key = tagLabel
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, '-');

      if (keys.has(key)) {
        continue;
      }

      keys.add(key);

      const tag = await this.get({ userId, key });

      if (!tag) {
        const item: ArtifactTagEntity = {
          ...this.buildKeys({ userId, key }),
          artifactTagId: randomUUID(),
          userId,
          key,
          label: tagLabel,
          count: 1,
        };

        put.push({
          keyNames: ['pk', 'sk'],
          item,
        });
      } else {
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
    }

    return { put, update };
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
    const { pk, sk, userId, artifactTagId, key, label, count } = data;

    if (
      typeof pk !== 'string' ||
      typeof sk !== 'string' ||
      typeof artifactTagId !== 'string' ||
      typeof userId !== 'string' ||
      typeof label !== 'string' ||
      typeof key !== 'string' ||
      typeof count !== 'number'
    ) {
      throw new Error('Unknown error');
    }

    return { pk, sk, userId, artifactTagId, key, label, count };
  }
}
