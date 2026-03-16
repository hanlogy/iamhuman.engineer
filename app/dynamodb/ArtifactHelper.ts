import type { UpdateConfig } from '@hanlogy/ts-dynamodb';
import { randomUUID } from 'crypto';
import type { Artifact, ArtifactType } from '@/definitions/types';
import { ArtifactByTagHelper } from './ArtifactByTagHelper';
import { ArtifactTagHelper } from './ArtifactTagHelper';
import { HelperBase } from './HelperBase';
import { diffArtifact } from './diffArtifact';
import type {
  ArtifactEntity,
  CreateArtifactParams,
  BuildPutItemsParams,
} from './types';

type ArtifactSetAttributes = Partial<{
  title: ArtifactEntity['title'];
  type: ArtifactEntity['type'];
  publishedAt: ArtifactEntity['publishedAt'];
  summary: ArtifactEntity['summary'];
  links: ArtifactEntity['links'];
  judgment: ArtifactEntity['judgment'];
  tags: ArtifactEntity['tags'];
  gsi1Pk: ArtifactEntity['gsi1Pk'];
  gsi1Sk: ArtifactEntity['gsi1Sk'];
  gsi2Pk: ArtifactEntity['gsi2Pk'];
  gsi2Sk: ArtifactEntity['gsi2Sk'];
}>;

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
      tags: resolvedTags.tagIds,
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
        ...byTagHelper.buildPutItems(commonAttributes),
        ...resolvedTags.put,
      ],
      update: resolvedTags.update,
    });
  }

  async updateItem({
    artifactId,
    title,
    userId,
    publishedAt,
    type,
    summary,
    links,
    judgment,
    tagLabels,
  }: CreateArtifactParams & {
    artifactId: string;
  }): Promise<void> {
    const oldArtifact = await this.get({ userId, artifactId });

    if (!oldArtifact) {
      throw new Error('Artifact not found');
    }

    const tagHelper = this.createHelper(ArtifactTagHelper);
    const byTagHelper = this.createHelper(ArtifactByTagHelper);

    const resolvedTags = await tagHelper.resolveTags(
      userId,
      tagLabels,
      oldArtifact.tags
    );

    const newArtifact: BuildPutItemsParams = {
      artifactId,
      userId,
      publishedAt,
      type,
      title,
      summary,
      links,
      judgment,
      tags: resolvedTags.tagIds,
    };

    const byTagChanges = byTagHelper.resolveUpdate({
      oldArtifact: {
        artifactId: oldArtifact.artifactId,
        userId: oldArtifact.userId,
        publishedAt: oldArtifact.publishedAt,
        type: oldArtifact.type,
        title: oldArtifact.title,
        summary: oldArtifact.summary,
        links: oldArtifact.links,
        judgment: oldArtifact.judgment,
        tags: oldArtifact.tags,
      },
      newArtifact,
    });

    const mainArtifactUpdate = this.buildUpdateItemConfig({
      oldArtifact,
      newArtifact,
    });

    const updateItems = this.hasUpdateAttributes(mainArtifactUpdate)
      ? [mainArtifactUpdate, ...resolvedTags.update, ...byTagChanges.update]
      : [...resolvedTags.update, ...byTagChanges.update];

    const putItems = [...resolvedTags.put, ...byTagChanges.put];
    const deleteItems = [...byTagChanges.delete];

    if (
      putItems.length === 0 &&
      updateItems.length === 0 &&
      deleteItems.length === 0
    ) {
      return;
    }

    await this.db.transactWrite({
      put: putItems,
      update: updateItems,
      delete: deleteItems,
    });
  }

  async deleteItem({
    userId,
    artifactId,
  }: {
    userId: string;
    artifactId: string;
  }): Promise<void> {
    const artifact = await this.get({ userId, artifactId });

    if (!artifact) {
      throw new Error('Artifact not found');
    }

    const byTagHelper = this.createHelper(ArtifactByTagHelper);
    const tagHelper = this.createHelper(ArtifactTagHelper);

    const byTagDeleteItems = byTagHelper.buildDeleteItems({
      userId: artifact.userId,
      artifactId: artifact.artifactId,
      publishedAt: artifact.publishedAt,
      tagIds: artifact.tags,
    });

    const tagCountUpdateItems = await tagHelper.buildDecreaseCountItems({
      userId: artifact.userId,
      artifactTagIds: artifact.tags,
    });

    await this.db.transactWrite({
      delete: [
        {
          keys: this.buildKeys({
            userId: artifact.userId,
            artifactId: artifact.artifactId,
          }),
        },
        ...byTagDeleteItems,
      ],
      update: tagCountUpdateItems,
    });
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

  private buildUpdateItemConfig({
    oldArtifact,
    newArtifact,
  }: {
    oldArtifact: ArtifactEntity;
    newArtifact: BuildPutItemsParams;
  }): UpdateConfig<
    ArtifactSetAttributes,
    ReturnType<ArtifactHelper['buildKeys']>
  > {
    const changedFields = diffArtifact(oldArtifact, newArtifact);
    const setAttributes: ArtifactSetAttributes = {};

    for (const field of changedFields) {
      if (field === 'title') {
        setAttributes.title = newArtifact.title;
        continue;
      }

      if (field === 'type') {
        setAttributes.type = newArtifact.type;
        setAttributes.gsi2Pk = this.buildGsi2Pk({
          userId: newArtifact.userId,
          type: newArtifact.type,
        });
        setAttributes.gsi2Sk = this.buildGsi2Sk({
          publishedAt: newArtifact.publishedAt,
          artifactId: newArtifact.artifactId,
        });
        continue;
      }

      if (field === 'publishedAt') {
        setAttributes.publishedAt = newArtifact.publishedAt;
        setAttributes.gsi1Sk = this.buildGsi1Sk({
          publishedAt: newArtifact.publishedAt,
          artifactId: newArtifact.artifactId,
        });
        setAttributes.gsi2Sk = this.buildGsi2Sk({
          publishedAt: newArtifact.publishedAt,
          artifactId: newArtifact.artifactId,
        });
        continue;
      }

      if (field === 'summary') {
        setAttributes.summary = newArtifact.summary;
        continue;
      }

      if (field === 'judgment') {
        setAttributes.judgment = newArtifact.judgment;
        continue;
      }

      if (field === 'links') {
        setAttributes.links = newArtifact.links;
        continue;
      }

      if (field === 'tags') {
        setAttributes.tags = newArtifact.tags;
      }
    }

    return {
      keys: this.buildKeys({
        userId: newArtifact.userId,
        artifactId: newArtifact.artifactId,
      }),
      setAttributes,
    };
  }

  private hasUpdateAttributes(
    updateConfig: UpdateConfig<
      ArtifactSetAttributes,
      ReturnType<ArtifactHelper['buildKeys']>
    >
  ): boolean {
    return Object.keys(updateConfig.setAttributes ?? {}).length > 0;
  }
}
