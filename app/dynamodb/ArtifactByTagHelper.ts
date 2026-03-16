import type { PutConfig } from '@hanlogy/ts-dynamodb';
import { HelperBase } from './HelperBase';
import type { BuildPutItemsParams } from './types';

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

  buildPutItems(artifact: BuildPutItemsParams): PutConfig[] {
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
}
