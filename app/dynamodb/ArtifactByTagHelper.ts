import type {
  DeleteConfig,
  PutConfig,
  SingleTableKeys,
  UpdateConfig,
} from '@hanlogy/ts-dynamodb';
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
    publishedAt,
    artifactId,
  }: {
    artifactTagId: string;
    publishedAt: string;
    artifactId: string;
  }) {
    return this.db.buildKey(
      this.version,
      artifactTagId,
      publishedAt,
      artifactId
    );
  }

  private buildKeys({
    userId,
    artifactId,
    publishedAt,
    artifactTagId,
  }: {
    userId: string;
    artifactTagId: string;
    publishedAt: string;
    artifactId: string;
  }) {
    return {
      pk: this.buildPk({ userId }),
      sk: this.buildSk({ artifactId, publishedAt, artifactTagId }),
    };
  }

  buildPutItems(artifact: BuildPutItemsParams): ByTagPutConfig[] {
    const { tags, userId, publishedAt, artifactId } = artifact;

    return tags.map((artifactTagId) => ({
      keyNames: ['pk', 'sk'],
      item: {
        ...this.buildKeys({
          userId,
          artifactId,
          publishedAt,
          artifactTagId,
        }),
        ...artifact,
      },
    }));
  }

  buildDeleteItems({
    userId,
    artifactId,
    publishedAt,
    tagIds,
  }: {
    userId: string;
    artifactId: string;
    publishedAt: string;
    tagIds: readonly string[];
  }): ByTagDeleteConfig[] {
    return tagIds.map((artifactTagId) => ({
      keys: this.buildKeys({
        userId,
        artifactId,
        publishedAt,
        artifactTagId,
      }),
    }));
  }

  private buildPutItemsByTagIds({
    artifact,
    tagIds,
  }: {
    artifact: BuildPutItemsParams;
    tagIds: readonly string[];
  }): ByTagPutConfig[] {
    const { userId, publishedAt, artifactId } = artifact;

    return tagIds.map((artifactTagId) => ({
      keyNames: ['pk', 'sk'],
      item: {
        ...this.buildKeys({
          userId,
          artifactId,
          publishedAt,
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
          publishedAt: oldArtifact.publishedAt,
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
        publishedAt: oldArtifact.publishedAt,
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
            publishedAt: newArtifact.publishedAt,
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

      if (field === 'tags') {
        setAttributes.tags = newArtifact.tags;
      }
    }

    return setAttributes;
  }

  private hasByTagKeyChange(changedFields: DiffArtifactResult): boolean {
    return (
      changedFields.includes('artifactId') ||
      changedFields.includes('publishedAt')
    );
  }
}
