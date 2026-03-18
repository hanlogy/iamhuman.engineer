import type {
  DeleteConfig,
  PutConfig,
  SingleTableKeys,
  UpdateConfig,
} from '@hanlogy/ts-dynamodb';
import type { Artifact } from '@/definitions';
import { HelperBase } from './HelperBase';
import { diffArtifact, type DiffArtifactResult } from './diffArtifact';
import { diffArtifactIds } from './diffArtifactIds';
import type { BuildPutItemsParams } from './types';

type ByTagSetAttributes = Partial<{
  title: BuildPutItemsParams['title'];
  type: BuildPutItemsParams['type'];
  summary: BuildPutItemsParams['summary'];
  judgment: BuildPutItemsParams['judgment'];
  links: BuildPutItemsParams['links'];
  tags: BuildPutItemsParams['tags'];
  image: BuildPutItemsParams['image'];
}>;

type ByTagPutConfig = PutConfig<
  BuildPutItemsParams & SingleTableKeys,
  keyof SingleTableKeys
>;

type ByTagUpdateConfig = UpdateConfig;

type ByTagDeleteConfig = DeleteConfig<SingleTableKeys>;

interface ResolveUpdateResult {
  readonly put: ByTagPutConfig[];
  readonly update: ByTagUpdateConfig[];
  readonly delete: ByTagDeleteConfig[];
}

export class ArtifactByTagHelper extends HelperBase {
  private entity = 'ARTIFACT_BY_TAG';
  private version = '01';

  private buildPk({ userId }: { userId: string }) {
    return this.db.buildKey(this.entity, userId);
  }

  private buildSk({
    artifactTagId,
    releaseDate,
    artifactId,
  }: {
    artifactTagId: string;
    releaseDate: string;
    artifactId: string;
  }) {
    return this.db.buildKey(
      this.version,
      artifactTagId,
      releaseDate,
      artifactId
    );
  }

  private buildKeys({
    userId,
    artifactId,
    releaseDate,
    artifactTagId,
  }: {
    userId: string;
    artifactTagId: string;
    releaseDate: string;
    artifactId: string;
  }) {
    return {
      pk: this.buildPk({ userId }),
      sk: this.buildSk({ artifactId, releaseDate, artifactTagId }),
    };
  }

  buildPutItems(artifact: BuildPutItemsParams): ByTagPutConfig[] {
    const { tags, userId, releaseDate, artifactId } = artifact;

    return tags.map((artifactTagId) => ({
      keyNames: ['pk', 'sk'],
      item: {
        ...this.buildKeys({
          userId,
          artifactId,
          releaseDate,
          artifactTagId,
        }),
        ...artifact,
      },
    }));
  }

  buildDeleteItems({
    userId,
    artifactId,
    releaseDate,
    tagIds,
  }: {
    userId: string;
    artifactId: string;
    releaseDate: string;
    tagIds: readonly string[];
  }): ByTagDeleteConfig[] {
    return tagIds.map((artifactTagId) => ({
      keys: this.buildKeys({
        userId,
        artifactId,
        releaseDate,
        artifactTagId,
      }),
    }));
  }

  async getItems({
    userId,
    artifactTagId,
  }: {
    userId: string;
    artifactTagId: string;
  }): Promise<Artifact[]> {
    const { items } = await this.db.query({
      descending: true,
      keyConditions: [
        {
          attribute: 'pk',
          value: this.buildPk({ userId }),
        },
        {
          attribute: 'sk',
          value: this.db.buildKey(this.version, artifactTagId),
          operator: 'begins_with',
        },
      ],
    });

    // TODO: Fix it later
    return items as Artifact[];
  }

  private buildPutItemsByTagIds({
    artifact,
    tagIds,
  }: {
    artifact: BuildPutItemsParams;
    tagIds: readonly string[];
  }): ByTagPutConfig[] {
    const { userId, releaseDate, artifactId } = artifact;

    return tagIds.map((artifactTagId) => ({
      keyNames: ['pk', 'sk'],
      item: {
        ...this.buildKeys({
          userId,
          artifactId,
          releaseDate,
          artifactTagId,
        }),
        ...artifact,
      },
    }));
  }

  resolveUpdate({
    oldArtifact,
    newArtifact,
  }: {
    oldArtifact: BuildPutItemsParams;
    newArtifact: BuildPutItemsParams;
  }): ResolveUpdateResult {
    const putItems: ByTagPutConfig[] = [];
    const updateItems: ByTagUpdateConfig[] = [];
    const deleteItems: ByTagDeleteConfig[] = [];

    const changedFields = diffArtifact(oldArtifact, newArtifact);

    if (changedFields.length === 0) {
      return {
        put: putItems,
        update: updateItems,
        delete: deleteItems,
      };
    }

    const {
      added: addedTagIds,
      removed: removedTagIds,
      unchanged: unchangedTags,
    } = diffArtifactIds(oldArtifact.tags, newArtifact.tags);

    const shouldRebuildAllItems = this.hasByTagKeyChange(changedFields);

    if (shouldRebuildAllItems) {
      deleteItems.push(
        ...this.buildDeleteItems({
          userId: oldArtifact.userId,
          artifactId: oldArtifact.artifactId,
          releaseDate: oldArtifact.releaseDate,
          tagIds: oldArtifact.tags,
        })
      );

      putItems.push(
        ...this.buildPutItemsByTagIds({
          artifact: newArtifact,
          tagIds: newArtifact.tags,
        })
      );

      return {
        put: putItems,
        update: updateItems,
        delete: deleteItems,
      };
    }

    deleteItems.push(
      ...this.buildDeleteItems({
        userId: oldArtifact.userId,
        artifactId: oldArtifact.artifactId,
        releaseDate: oldArtifact.releaseDate,
        tagIds: removedTagIds,
      })
    );

    putItems.push(
      ...this.buildPutItemsByTagIds({
        artifact: newArtifact,
        tagIds: addedTagIds,
      })
    );

    if (unchangedTags.length > 0) {
      const setAttributes = this.buildUpdateAttributes({
        changedFields,
        newArtifact,
      });

      updateItems.push(
        ...unchangedTags.map((artifactTagId) => ({
          keys: this.buildKeys({
            userId: newArtifact.userId,
            artifactId: newArtifact.artifactId,
            releaseDate: newArtifact.releaseDate,
            artifactTagId,
          }),
          setAttributes,
        }))
      );
    }

    return {
      put: putItems,
      update: updateItems,
      delete: deleteItems,
    };
  }

  private buildUpdateAttributes({
    changedFields,
    newArtifact,
  }: {
    changedFields: DiffArtifactResult;
    newArtifact: BuildPutItemsParams;
  }): ByTagSetAttributes {
    const setAttributes: ByTagSetAttributes = {};

    for (const field of changedFields) {
      if (field === 'title') {
        setAttributes.title = newArtifact.title;
        continue;
      }

      if (field === 'type') {
        setAttributes.type = newArtifact.type;
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
      if (field === 'image') {
        setAttributes.image = newArtifact.image;
        continue;
      }

      if (field === 'tags') {
        setAttributes.tags = newArtifact.tags;
      }
    }

    return setAttributes;
  }

  private hasByTagKeyChange(changedFields: DiffArtifactResult): boolean {
    return (
      changedFields.includes('artifactId') ||
      changedFields.includes('releaseDate')
    );
  }
}
