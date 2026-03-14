import { HelperBase } from './HelperBase';

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

  buildKeys({
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
}
