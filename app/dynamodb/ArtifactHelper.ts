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
  UpdateArtifactParams,
} from './types';

type ArtifactSetAttributes = Partial<{
  title: ArtifactEntity['title'];
  type: ArtifactEntity['type'];
  releaseDate: ArtifactEntity['releaseDate'];
  summary: ArtifactEntity['summary'];
  links: ArtifactEntity['links'];
  judgment: ArtifactEntity['judgment'];
  tags: ArtifactEntity['tags'];
  gsi1Pk: ArtifactEntity['gsi1Pk'];
  gsi1Sk: ArtifactEntity['gsi1Sk'];
  gsi2Pk: ArtifactEntity['gsi2Pk'];
  gsi2Sk: ArtifactEntity['gsi2Sk'];
  gsi3Pk: ArtifactEntity['gsi3Pk'];
  gsi3Sk: ArtifactEntity['gsi3Sk'];
}>;

export class ArtifactHelper extends HelperBase {
  private entity = 'ARTIFACT';
  private version = '01';

  private buildPk({ artifactId }: { artifactId: string }) {
    return this.db.buildKey(this.entity, artifactId);
  }

  private buildSk() {
    return this.db.buildKey(this.version, true);
  }

  private buildKeys({ artifactId }: { artifactId: string }) {
    return { pk: this.buildPk({ artifactId }), sk: this.buildSk() };
  }

  private buildGsi1Pk({ userId }: { userId: string }) {
    return this.db.buildKey(this.entity, userId);
  }

  private buildGsi1Sk({
    releaseDate,
    artifactId,
  }: {
    releaseDate: string;
    artifactId: string;
  }) {
    return this.db.buildKey(this.version, releaseDate, artifactId, true);
  }

  private buildGsi1Keys({
    userId,
    releaseDate,
    artifactId,
  }: {
    userId: string;
    releaseDate: string;
    artifactId: string;
  }) {
    return {
      gsi1Pk: this.buildGsi1Pk({ userId }),
      gsi1Sk: this.buildGsi1Sk({ releaseDate, artifactId }),
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
    releaseDate,
    artifactId,
  }: {
    userId: string;
    type: ArtifactType;
    releaseDate: string;
    artifactId: string;
  }) {
    return {
      gsi2Pk: this.buildGsi2Pk({ userId, type }),
      gsi2Sk: this.buildGsi2Sk({ releaseDate, artifactId }),
    };
  }

  private buildGsi3Pk({ type }: { type: ArtifactType }) {
    return this.db.buildKey(this.entity, type);
  }

  private buildGsi3Sk = this.buildGsi1Sk;

  private buildGsi3Keys({
    type,
    releaseDate,
    artifactId,
  }: {
    type: ArtifactType;
    releaseDate: string;
    artifactId: string;
  }) {
    return {
      gsi3Pk: this.buildGsi3Pk({ type }),
      gsi3Sk: this.buildGsi3Sk({ releaseDate, artifactId }),
    };
  }

  async get({
    artifactId,
  }: {
    artifactId: string;
  }): Promise<ArtifactEntity | null> {
    const { item } = await this.db.get({
      keys: this.buildKeys({ artifactId }),
    });
    if (!item) {
      return null;
    }
    return item as ArtifactEntity;
  }

  async createItem({
    title,
    userId,
    releaseDate,
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
      releaseDate,
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
            ...this.buildKeys({ artifactId }),
            ...this.buildGsi1Keys({ userId, artifactId, releaseDate }),
            ...this.buildGsi2Keys({ userId, artifactId, type, releaseDate }),
            ...this.buildGsi3Keys({ artifactId, type, releaseDate }),
            ...commonAttributes,
          },
        },
        ...byTagHelper.buildPutItems(commonAttributes),
        ...resolvedTags.put,
      ],
      update: resolvedTags.update,
    });
  }

  async updateItem(
    { userId, artifactId }: { userId: string; artifactId: string },
    {
      title,
      releaseDate,
      type,
      summary,
      links,
      judgment,
      tagLabels,
    }: UpdateArtifactParams
  ): Promise<void> {
    const oldArtifact = await this.get({ artifactId });

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
      releaseDate,
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
        releaseDate: oldArtifact.releaseDate,
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
    const artifact = await this.get({ artifactId });

    if (!artifact || artifact.userId !== userId) {
      throw new Error('Artifact not found');
    }

    const byTagHelper = this.createHelper(ArtifactByTagHelper);
    const tagHelper = this.createHelper(ArtifactTagHelper);

    const byTagDeleteItems = byTagHelper.buildDeleteItems({
      userId: artifact.userId,
      artifactId: artifact.artifactId,
      releaseDate: artifact.releaseDate,
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
            artifactId: artifact.artifactId,
          }),
        },
        ...byTagDeleteItems,
      ],
      update: tagCountUpdateItems,
    });
  }

  async getItem({
    artifactId,
  }: {
    artifactId: string;
  }): Promise<Artifact | null> {
    const entity = await this.get({ artifactId });
    if (!entity) {
      return null;
    }

    return this.buildArtifact(entity);
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

    return items.map((e) => this.buildArtifact(e as ArtifactEntity));
  }

  private buildArtifact(entity: ArtifactEntity): Artifact {
    const {
      pk: _pk,
      sk: _sk,
      gsi1Pk: _gsi1Pk,
      gsi1Sk: _gsi1Sk,
      gsi2Pk: _gsi2Pk,
      gsi2Sk: _gsi2Sk,
      gsi3Pk: _gsi3Pk,
      gsi3Sk: _gsi3Sk,
      ...rest
    } = entity;

    return rest;
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
        setAttributes.gsi3Pk = this.buildGsi3Pk({
          type: newArtifact.type,
        });
        continue;
      }

      if (field === 'releaseDate') {
        setAttributes.releaseDate = newArtifact.releaseDate;
        setAttributes.gsi1Sk = this.buildGsi1Sk({
          releaseDate: newArtifact.releaseDate,
          artifactId: newArtifact.artifactId,
        });
        setAttributes.gsi2Sk = this.buildGsi2Sk({
          releaseDate: newArtifact.releaseDate,
          artifactId: newArtifact.artifactId,
        });
        setAttributes.gsi3Sk = this.buildGsi3Sk({
          releaseDate: newArtifact.releaseDate,
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
