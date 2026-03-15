import { ArtifactByTagHelper } from '@/dynamodb/ArtifactByTagHelper';
import { FakeDynamoDBHelper } from './FakeDynamoDBHelper';

describe('ArtifactByTagHelper', () => {
  let db: FakeDynamoDBHelper;
  let helper: ArtifactByTagHelper;

  beforeEach(() => {
    db = new FakeDynamoDBHelper();
    helper = new ArtifactByTagHelper({ db });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('buildKeys', () => {
    const result = helper.buildKeys({
      userId: 'user-1',
      artifactTagId: 'tag-1',
      publishedAt: '2026-03-15T10:00:00.000Z',
      artifactId: 'artifact-1',
    });

    expect(result).toStrictEqual({
      pk: 'ARTIFACT_BY_TAG|user-1',
      sk: '01|tag-1|2026-03-15T10:00:00.000Z|artifact-1',
    });
  });

  test('buildKeys call buildKey with correct arguments', () => {
    helper.buildKeys({
      userId: 'user-1',
      artifactTagId: 'tag-1',
      publishedAt: '2026-03-15T10:00:00.000Z',
      artifactId: 'artifact-1',
    });

    expect(db.buildKey).toHaveBeenNthCalledWith(1, 'ARTIFACT_BY_TAG', 'user-1');
    expect(db.buildKey).toHaveBeenNthCalledWith(
      2,
      '01',
      'tag-1',
      '2026-03-15T10:00:00.000Z',
      'artifact-1'
    );
  });
});
