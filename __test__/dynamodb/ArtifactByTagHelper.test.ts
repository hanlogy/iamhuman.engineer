import { ArtifactByTagHelper } from '@/dynamodb/ArtifactByTagHelper';
import type { BuildPutItemsParams } from '@/dynamodb/types';
import { FakeDynamoDBHelper } from './FakeDynamoDBHelper';

const paramsBase: Omit<BuildPutItemsParams, 'tags'> = {
  artifactId: 'artifact-1',
  userId: 'user-1',
  publishedAt: '2026-03-15T10:00:00.000Z',
  type: 'research',
  title: 'React Notes',
  summary: 'summary',
  links: [{ title: 'example', url: 'https://example.com' }],
  judgment: 'good',
};

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

  test('with tags', () => {
    const tags = ['tag-1', 'tag-2'];
    const result = helper.buildPutItems({
      ...paramsBase,
      tags,
    });

    expect(result).toStrictEqual([
      {
        keyNames: ['pk', 'sk'],
        item: {
          pk: 'ARTIFACT_BY_TAG|user-1',
          sk: '01|tag-1|2026-03-15T10:00:00.000Z|artifact-1',
          ...paramsBase,
          tags,
        },
      },
      {
        keyNames: ['pk', 'sk'],
        item: {
          pk: 'ARTIFACT_BY_TAG|user-1',
          sk: '01|tag-2|2026-03-15T10:00:00.000Z|artifact-1',
          ...paramsBase,
          tags,
        },
      },
    ]);
  });

  test('with empty tags', () => {
    const result = helper.buildPutItems({ ...paramsBase, tags: [] });

    expect(result).toStrictEqual([]);
    expect(db.buildKey).not.toHaveBeenCalled();
  });
});
