import { ArtifactByTagHelper } from '@/dynamodb/ArtifactByTagHelper';
import type { BuildPutItemsParams } from '@/dynamodb/types';
import { FakeDynamoDBHelper } from './FakeDynamoDBHelper';

const artifactBase: Omit<BuildPutItemsParams, 'tags'> = {
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

  describe('buildPutItems', () => {
    test('with tags', () => {
      const tags = ['1-1-1-1', '2-2-2-2'];
      const result = helper.buildPutItems({
        ...artifactBase,
        tags,
      });

      expect(result).toStrictEqual([
        {
          keyNames: ['pk', 'sk'],
          item: {
            pk: 'ARTIFACT_BY_TAG|user-1',
            sk: '01|1-1-1-1|2026-03-15T10:00:00.000Z|artifact-1',
            ...artifactBase,
            tags,
          },
        },
        {
          keyNames: ['pk', 'sk'],
          item: {
            pk: 'ARTIFACT_BY_TAG|user-1',
            sk: '01|2-2-2-2|2026-03-15T10:00:00.000Z|artifact-1',
            ...artifactBase,
            tags,
          },
        },
      ]);
    });

    test('with empty tags', () => {
      const result = helper.buildPutItems({ ...artifactBase, tags: [] });

      expect(result).toStrictEqual([]);
      expect(db.buildKey).not.toHaveBeenCalled();
    });
  });

  describe('resolveUpdate', () => {
    const tags = ['1-1-1-1', '2-2-2-2'];

    test('no change', () => {
      const result = helper.resolveUpdate({
        oldArtifact: { ...artifactBase, tags: [...tags] },
        newArtifact: { ...artifactBase, tags: [...tags] },
      });

      expect(result).toStrictEqual({
        put: [],
        update: [],
        delete: [],
      });
    });

    test('title only', () => {
      const tags = ['1-1-1-1', '2-2-2-2'];
      const newTitle = 'React Notes Updated';
      const result = helper.resolveUpdate({
        oldArtifact: { ...artifactBase, tags: [...tags] },
        newArtifact: {
          ...artifactBase,
          tags: [...tags],
          title: newTitle,
        },
      });

      expect(result).toStrictEqual({
        put: [],
        update: [
          {
            keys: {
              pk: 'ARTIFACT_BY_TAG|user-1',
              sk: '01|1-1-1-1|2026-03-15T10:00:00.000Z|artifact-1',
            },
            setAttributes: {
              title: newTitle,
            },
          },
          {
            keys: {
              pk: 'ARTIFACT_BY_TAG|user-1',
              sk: '01|2-2-2-2|2026-03-15T10:00:00.000Z|artifact-1',
            },
            setAttributes: {
              title: newTitle,
            },
          },
        ],
        delete: [],
      });
    });

    test('add tag', () => {
      const oldTags = ['1-1-1-1', '2-2-2-2'];
      const newTags = ['1-1-1-1', '2-2-2-2', '3-3-3-3'];
      const result = helper.resolveUpdate({
        oldArtifact: { ...artifactBase, tags: oldTags },
        newArtifact: {
          ...artifactBase,
          tags: newTags,
        },
      });

      expect(result).toStrictEqual({
        put: [
          {
            keyNames: ['pk', 'sk'],
            item: {
              pk: 'ARTIFACT_BY_TAG|user-1',
              sk: '01|3-3-3-3|2026-03-15T10:00:00.000Z|artifact-1',
              ...artifactBase,
              tags: newTags,
            },
          },
        ],
        update: [
          {
            keys: {
              pk: 'ARTIFACT_BY_TAG|user-1',
              sk: '01|1-1-1-1|2026-03-15T10:00:00.000Z|artifact-1',
            },
            setAttributes: {
              tags: newTags,
            },
          },
          {
            keys: {
              pk: 'ARTIFACT_BY_TAG|user-1',
              sk: '01|2-2-2-2|2026-03-15T10:00:00.000Z|artifact-1',
            },
            setAttributes: {
              tags: newTags,
            },
          },
        ],
        delete: [],
      });
    });

    test('remove tag', () => {
      const oldTags = ['1-1-1-1', '2-2-2-2'];
      const newTags = ['1-1-1-1'];

      const result = helper.resolveUpdate({
        oldArtifact: { ...artifactBase, tags: oldTags },
        newArtifact: { ...artifactBase, tags: newTags },
      });

      expect(result).toStrictEqual({
        put: [],
        update: [
          {
            keys: {
              pk: 'ARTIFACT_BY_TAG|user-1',
              sk: '01|1-1-1-1|2026-03-15T10:00:00.000Z|artifact-1',
            },
            setAttributes: {
              tags: newTags,
            },
          },
        ],
        delete: [
          {
            keys: {
              pk: 'ARTIFACT_BY_TAG|user-1',
              sk: '01|2-2-2-2|2026-03-15T10:00:00.000Z|artifact-1',
            },
          },
        ],
      });
    });

    test('add and remove tags together', () => {
      const oldTags = ['1-1-1-1', '2-2-2-2'];
      const newTags = ['2-2-2-2', '3-3-3-3'];
      const result = helper.resolveUpdate({
        oldArtifact: { ...artifactBase, tags: oldTags },
        newArtifact: { ...artifactBase, tags: newTags },
      });

      expect(result).toStrictEqual({
        put: [
          {
            keyNames: ['pk', 'sk'],
            item: {
              pk: 'ARTIFACT_BY_TAG|user-1',
              sk: '01|3-3-3-3|2026-03-15T10:00:00.000Z|artifact-1',
              ...artifactBase,
              tags: newTags,
            },
          },
        ],
        update: [
          {
            keys: {
              pk: 'ARTIFACT_BY_TAG|user-1',
              sk: '01|2-2-2-2|2026-03-15T10:00:00.000Z|artifact-1',
            },
            setAttributes: {
              tags: newTags,
            },
          },
        ],
        delete: [
          {
            keys: {
              pk: 'ARTIFACT_BY_TAG|user-1',
              sk: '01|1-1-1-1|2026-03-15T10:00:00.000Z|artifact-1',
            },
          },
        ],
      });
    });

    test('publishedAt changed', () => {
      const tags = ['1-1-1-1', '2-2-2-2'];
      const result = helper.resolveUpdate({
        oldArtifact: { ...artifactBase, tags },
        newArtifact: {
          ...artifactBase,
          tags,
          publishedAt: '2026-03-16T10:00:00.000Z',
        },
      });

      expect(result).toStrictEqual({
        put: [
          {
            keyNames: ['pk', 'sk'],
            item: {
              pk: 'ARTIFACT_BY_TAG|user-1',
              sk: '01|1-1-1-1|2026-03-16T10:00:00.000Z|artifact-1',
              ...artifactBase,
              tags,
              publishedAt: '2026-03-16T10:00:00.000Z',
            },
          },
          {
            keyNames: ['pk', 'sk'],
            item: {
              pk: 'ARTIFACT_BY_TAG|user-1',
              sk: '01|2-2-2-2|2026-03-16T10:00:00.000Z|artifact-1',
              ...artifactBase,
              tags,
              publishedAt: '2026-03-16T10:00:00.000Z',
            },
          },
        ],
        update: [],
        delete: [
          {
            keys: {
              pk: 'ARTIFACT_BY_TAG|user-1',
              sk: '01|1-1-1-1|2026-03-15T10:00:00.000Z|artifact-1',
            },
          },
          {
            keys: {
              pk: 'ARTIFACT_BY_TAG|user-1',
              sk: '01|2-2-2-2|2026-03-15T10:00:00.000Z|artifact-1',
            },
          },
        ],
      });
    });

    test('publishedAt changed, with add and remove tags', () => {
      const oldTags = ['1-1-1-1', '2-2-2-2'];
      const newTags = ['2-2-2-2', '3-3-3-3'];
      const newPublishedAt = '2026-03-16T10:00:00.000Z';

      const result = helper.resolveUpdate({
        oldArtifact: { ...artifactBase, tags: oldTags },
        newArtifact: {
          ...artifactBase,
          tags: newTags,
          publishedAt: newPublishedAt,
        },
      });

      expect(result).toStrictEqual({
        put: [
          {
            keyNames: ['pk', 'sk'],
            item: {
              pk: 'ARTIFACT_BY_TAG|user-1',
              sk: '01|2-2-2-2|2026-03-16T10:00:00.000Z|artifact-1',
              ...artifactBase,
              tags: newTags,
              publishedAt: newPublishedAt,
            },
          },
          {
            keyNames: ['pk', 'sk'],
            item: {
              pk: 'ARTIFACT_BY_TAG|user-1',
              sk: '01|3-3-3-3|2026-03-16T10:00:00.000Z|artifact-1',
              ...artifactBase,
              tags: newTags,
              publishedAt: newPublishedAt,
            },
          },
        ],
        update: [],
        delete: [
          {
            keys: {
              pk: 'ARTIFACT_BY_TAG|user-1',
              sk: '01|1-1-1-1|2026-03-15T10:00:00.000Z|artifact-1',
            },
          },
          {
            keys: {
              pk: 'ARTIFACT_BY_TAG|user-1',
              sk: '01|2-2-2-2|2026-03-15T10:00:00.000Z|artifact-1',
            },
          },
        ],
      });
    });
  });
});
