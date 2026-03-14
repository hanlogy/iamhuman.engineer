import { randomUUID } from 'crypto';
import { HelperBase } from './HelperBase';
import type { ArtifactTagEntity } from './types';

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
  }: Omit<ArtifactTagEntity, 'pk' | 'sk' | 'artifactTagId' | 'count'>) {
    const artifactTagId = randomUUID();
    await this.db.put({
      keyNames: ['pk', 'sk'],
      item: {
        ...this.buildKeys({ userId, key }),
        artifactTagId,
        userId,
        key,
        label,
        count: 0,
      },
    });

    return { artifactTagId };
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

  async resolveTags(userId: string, tagLabels: string[]) {
    const resolvedId: string[] = [];
    const keys = new Set<string>();

    for (let tagLabel of tagLabels) {
      tagLabel = tagLabel.trim();
      if (!tagLabel) {
        continue;
      }

      const key = tagLabel.toLowerCase().replace(/[\s-]+/g, '');
      if (keys.has(key)) {
        continue;
      }
      keys.add(key);
      const tag = await this.get({ userId, key });

      if (!tag) {
        const { artifactTagId } = await this.create({
          userId,
          key,
          label: tagLabel,
        });
        resolvedId.push(artifactTagId);
      } else {
        resolvedId.push(tag.artifactTagId);
      }
    }

    return resolvedId;
  }
}
