import { randomUUID } from 'crypto';
import { ArtifactHelper } from '@/dynamodb/ArtifactHelper';
import { diffArtifact } from '@/dynamodb/diffArtifact';
import type { ArtifactEntity } from '@/dynamodb/types';
import { FakeDynamoDBHelper } from './FakeDynamoDBHelper';

const mockResolveTags = jest.fn();
const mockBuildDecreaseCountItems = jest.fn();
const mockBuildPutItems = jest.fn();
const mockBuildDeleteItems = jest.fn();
const mockResolveUpdate = jest.fn();

const tagHelperInstances: Array<{
  resolveTags: typeof mockResolveTags;
  buildDecreaseCountItems: typeof mockBuildDecreaseCountItems;
}> = [];

const byTagHelperInstances: Array<{
  buildPutItems: typeof mockBuildPutItems;
  buildDeleteItems: typeof mockBuildDeleteItems;
  resolveUpdate: typeof mockResolveUpdate;
}> = [];

jest.mock('crypto', () => ({
  randomUUID: jest.fn(),
}));

jest.mock('../../app/dynamodb/diffArtifact', () => ({
  diffArtifact: jest.fn(),
}));

jest.mock('../../app/dynamodb/ArtifactTagHelper', () => ({
  ArtifactTagHelper: jest.fn().mockImplementation(() => {
    const instance = {
      resolveTags: mockResolveTags,
      buildDecreaseCountItems: mockBuildDecreaseCountItems,
    };

    tagHelperInstances.push(instance);

    return instance;
  }),
}));

jest.mock('../../app/dynamodb/ArtifactByTagHelper', () => ({
  ArtifactByTagHelper: jest.fn().mockImplementation(() => {
    const instance = {
      buildPutItems: mockBuildPutItems,
      buildDeleteItems: mockBuildDeleteItems,
      resolveUpdate: mockResolveUpdate,
    };

    byTagHelperInstances.push(instance);

    return instance;
  }),
}));

const randomUUIDMock = randomUUID as jest.Mock;
const diffArtifactMock = diffArtifact as jest.Mock;

describe('ArtifactHelper', () => {
  const userId = 'user-1';
  const artifactId = 'artifact-1';
  const pk = 'ARTIFACT|user-1';
  const sk = '01|artifact-1|true';
  const publishedAt = '2026-03-15';
  const links = [{ title: 'Example', url: 'https://example.com' }];

  let db: FakeDynamoDBHelper;
  let helper: ArtifactHelper;

  beforeEach(() => {
    db = new FakeDynamoDBHelper();
    helper = new ArtifactHelper({ db });

    tagHelperInstances.length = 0;
    byTagHelperInstances.length = 0;

    jest.clearAllMocks();
  });

  function createArtifactEntity(
    override: Partial<ArtifactEntity> = {}
  ): ArtifactEntity {
    return {
      pk,
      sk,
      gsi1Pk: pk,
      gsi1Sk: '01|2026-03-15|artifact-1|true',
      gsi2Pk: 'ARTIFACT|user-1|research',
      gsi2Sk: '01|2026-03-15|artifact-1|true',
      artifactId,
      userId,
      title: 'My title',
      type: 'research',
      tags: ['tag-1', 'tag-2'],
      publishedAt,
      summary: 'summary',
      links,
      judgment: 'good',
      createdAt: '2026-03-15T10:00:00.000Z',
      updatedAt: '2026-03-15T10:00:00.000Z',
      ...override,
    };
  }

  describe('get', () => {
    test('with result', async () => {
      const item = createArtifactEntity();
      db.get.mockResolvedValue({ item });

      const result = await helper.get({ userId, artifactId });

      expect(db.get).toHaveBeenCalledWith({
        keys: {
          pk,
          sk,
        },
      });
      expect(result).toStrictEqual(item);
    });

    test('without result', async () => {
      db.get.mockResolvedValue({ item: undefined });

      const result = await helper.get({ userId, artifactId });

      expect(db.get).toHaveBeenCalledWith({
        keys: {
          pk,
          sk,
        },
      });
      expect(result).toBeUndefined();
    });
  });

  describe('createItem', () => {
    test('create item', async () => {
      randomUUIDMock.mockReturnValue(artifactId);
      mockResolveTags.mockResolvedValue({
        tagIds: ['tag-1', 'tag-2'],
        put: [
          {
            keyNames: ['pk', 'sk'],
            item: {
              pk: 'ARTIFACT_TAG|user-1',
              sk: '01|react|true',
            },
          },
        ],
        update: [
          {
            keys: {
              pk: 'ARTIFACT_TAG|user-1',
              sk: '01|node-js|true',
            },
            setAttributes: {
              count: 2,
            },
          },
        ],
      });
      mockBuildPutItems.mockReturnValue([
        {
          keyNames: ['pk', 'sk'],
          item: {
            pk: 'ARTIFACT_BY_TAG|user-1',
            sk: '01|tag-1|2026-03-15|artifact-1',
          },
        },
      ]);

      await helper.createItem({
        userId,
        title: 'My title',
        type: 'research',
        publishedAt,
        summary: 'summary',
        links,
        judgment: 'good',
        tagLabels: ['React', 'Node JS'],
      });

      expect(mockResolveTags).toHaveBeenCalledWith(userId, [
        'React',
        'Node JS',
      ]);
      expect(mockBuildPutItems).toHaveBeenCalledWith({
        tags: ['tag-1', 'tag-2'],
        userId,
        type: 'research',
        publishedAt,
        artifactId,
        title: 'My title',
        summary: 'summary',
        links,
        judgment: 'good',
      });
      expect(db.transactWrite).toHaveBeenCalledWith({
        put: [
          {
            keyNames: ['pk', 'sk'],
            item: {
              pk,
              sk,
              gsi1Pk: pk,
              gsi1Sk: '01|2026-03-15|artifact-1|true',
              gsi2Pk: 'ARTIFACT|user-1|research',
              gsi2Sk: '01|2026-03-15|artifact-1|true',
              tags: ['tag-1', 'tag-2'],
              userId,
              type: 'research',
              publishedAt,
              artifactId,
              title: 'My title',
              summary: 'summary',
              links,
              judgment: 'good',
            },
          },
          {
            keyNames: ['pk', 'sk'],
            item: {
              pk: 'ARTIFACT_BY_TAG|user-1',
              sk: '01|tag-1|2026-03-15|artifact-1',
            },
          },
          {
            keyNames: ['pk', 'sk'],
            item: {
              pk: 'ARTIFACT_TAG|user-1',
              sk: '01|react|true',
            },
          },
        ],
        update: [
          {
            keys: {
              pk: 'ARTIFACT_TAG|user-1',
              sk: '01|node-js|true',
            },
            setAttributes: {
              count: 2,
            },
          },
        ],
      });
    });
  });

  describe('updateItem', () => {
    test('artifact not found', async () => {
      db.get.mockResolvedValue({ item: undefined });

      await expect(
        helper.updateItem(
          {
            artifactId,
            userId,
          },
          {
            title: 'My title',
            type: 'research',
            publishedAt,
            summary: 'summary',
            links,
            judgment: 'good',
            tagLabels: ['React'],
          }
        )
      ).rejects.toThrow('Artifact not found');
    });

    test('no change', async () => {
      db.get.mockResolvedValue({
        item: createArtifactEntity(),
      });
      mockResolveTags.mockResolvedValue({
        tagIds: ['tag-1', 'tag-2'],
        put: [],
        update: [],
      });
      mockResolveUpdate.mockReturnValue({
        put: [],
        update: [],
        delete: [],
      });
      diffArtifactMock.mockReturnValue([]);

      await helper.updateItem(
        {
          artifactId,
          userId,
        },
        {
          title: 'My title',
          type: 'research',
          publishedAt,
          summary: 'summary',
          links,
          judgment: 'good',
          tagLabels: ['React', 'Node JS'],
        }
      );

      expect(mockResolveTags).toHaveBeenCalledWith(
        userId,
        ['React', 'Node JS'],
        ['tag-1', 'tag-2']
      );
      expect(mockResolveUpdate).toHaveBeenCalledWith({
        oldArtifact: {
          artifactId,
          userId,
          publishedAt,
          type: 'research',
          title: 'My title',
          summary: 'summary',
          links,
          judgment: 'good',
          tags: ['tag-1', 'tag-2'],
        },
        newArtifact: {
          artifactId,
          userId,
          publishedAt,
          type: 'research',
          title: 'My title',
          summary: 'summary',
          links,
          judgment: 'good',
          tags: ['tag-1', 'tag-2'],
        },
      });
      expect(db.transactWrite).not.toHaveBeenCalled();
    });

    test('with changes', async () => {
      db.get.mockResolvedValue({
        item: createArtifactEntity(),
      });
      mockResolveTags.mockResolvedValue({
        tagIds: ['tag-1', 'tag-3'],
        put: [
          {
            keyNames: ['pk', 'sk'],
            item: {
              pk: 'ARTIFACT_TAG|user-1',
              sk: '01|vue-js|true',
            },
          },
        ],
        update: [
          {
            keys: {
              pk: 'ARTIFACT_TAG|user-1',
              sk: '01|react|true',
            },
            setAttributes: {
              count: 3,
            },
          },
        ],
      });
      mockResolveUpdate.mockReturnValue({
        put: [
          {
            keyNames: ['pk', 'sk'],
            item: {
              pk: 'ARTIFACT_BY_TAG|user-1',
              sk: '01|tag-3|2026-03-16|artifact-1',
            },
          },
        ],
        update: [
          {
            keys: {
              pk: 'ARTIFACT_BY_TAG|user-1',
              sk: '01|tag-1|2026-03-15|artifact-1',
            },
            setAttributes: {
              title: 'New title',
            },
          },
        ],
        delete: [
          {
            keys: {
              pk: 'ARTIFACT_BY_TAG|user-1',
              sk: '01|tag-2|2026-03-15|artifact-1',
            },
          },
        ],
      });
      diffArtifactMock.mockReturnValue([
        'title',
        'publishedAt',
        'type',
        'tags',
      ]);

      await helper.updateItem(
        {
          artifactId,
          userId,
        },
        {
          title: 'New title',
          type: 'knowledge',
          publishedAt: '2026-03-16',
          summary: 'summary',
          links,
          judgment: 'good',
          tagLabels: ['React', 'Vue JS'],
        }
      );

      expect(db.transactWrite).toHaveBeenCalledWith({
        put: [
          {
            keyNames: ['pk', 'sk'],
            item: {
              pk: 'ARTIFACT_TAG|user-1',
              sk: '01|vue-js|true',
            },
          },
          {
            keyNames: ['pk', 'sk'],
            item: {
              pk: 'ARTIFACT_BY_TAG|user-1',
              sk: '01|tag-3|2026-03-16|artifact-1',
            },
          },
        ],
        update: [
          {
            keys: {
              pk,
              sk,
            },
            setAttributes: {
              title: 'New title',
              publishedAt: '2026-03-16',
              gsi1Sk: '01|2026-03-16|artifact-1|true',
              type: 'knowledge',
              gsi2Pk: 'ARTIFACT|user-1|knowledge',
              gsi2Sk: '01|2026-03-16|artifact-1|true',
              tags: ['tag-1', 'tag-3'],
            },
          },
          {
            keys: {
              pk: 'ARTIFACT_TAG|user-1',
              sk: '01|react|true',
            },
            setAttributes: {
              count: 3,
            },
          },
          {
            keys: {
              pk: 'ARTIFACT_BY_TAG|user-1',
              sk: '01|tag-1|2026-03-15|artifact-1',
            },
            setAttributes: {
              title: 'New title',
            },
          },
        ],
        delete: [
          {
            keys: {
              pk: 'ARTIFACT_BY_TAG|user-1',
              sk: '01|tag-2|2026-03-15|artifact-1',
            },
          },
        ],
      });
    });

    test('only dependency updates without main update', async () => {
      db.get.mockResolvedValue({
        item: createArtifactEntity(),
      });
      mockResolveTags.mockResolvedValue({
        tagIds: ['tag-1', 'tag-2'],
        put: [],
        update: [
          {
            keys: {
              pk: 'ARTIFACT_TAG|user-1',
              sk: '01|react|true',
            },
            setAttributes: {
              count: 1,
            },
          },
        ],
      });
      mockResolveUpdate.mockReturnValue({
        put: [],
        update: [],
        delete: [],
      });
      diffArtifactMock.mockReturnValue([]);

      await helper.updateItem(
        {
          artifactId,
          userId,
        },
        {
          title: 'My title',
          type: 'research',
          publishedAt,
          summary: 'summary',
          links,
          judgment: 'good',
          tagLabels: ['React', 'Node JS'],
        }
      );

      expect(db.transactWrite).toHaveBeenCalledWith({
        put: [],
        update: [
          {
            keys: {
              pk: 'ARTIFACT_TAG|user-1',
              sk: '01|react|true',
            },
            setAttributes: {
              count: 1,
            },
          },
        ],
        delete: [],
      });
    });
  });

  describe('deleteItem', () => {
    test('artifact not found', async () => {
      db.get.mockResolvedValue({ item: undefined });

      await expect(helper.deleteItem({ userId, artifactId })).rejects.toThrow(
        'Artifact not found'
      );
    });

    test('delete item', async () => {
      db.get.mockResolvedValue({
        item: createArtifactEntity(),
      });
      mockBuildDeleteItems.mockReturnValue([
        {
          keys: {
            pk: 'ARTIFACT_BY_TAG|user-1',
            sk: '01|tag-1|2026-03-15|artifact-1',
          },
        },
      ]);
      mockBuildDecreaseCountItems.mockResolvedValue([
        {
          keys: {
            pk: 'ARTIFACT_TAG|user-1',
            sk: '01|react|true',
          },
          setAttributes: {
            count: 1,
          },
        },
      ]);

      await helper.deleteItem({ userId, artifactId });

      expect(mockBuildDeleteItems).toHaveBeenCalledWith({
        userId,
        artifactId,
        publishedAt,
        tagIds: ['tag-1', 'tag-2'],
      });
      expect(mockBuildDecreaseCountItems).toHaveBeenCalledWith({
        userId,
        artifactTagIds: ['tag-1', 'tag-2'],
      });
      expect(db.transactWrite).toHaveBeenCalledWith({
        delete: [
          {
            keys: {
              pk,
              sk,
            },
          },
          {
            keys: {
              pk: 'ARTIFACT_BY_TAG|user-1',
              sk: '01|tag-1|2026-03-15|artifact-1',
            },
          },
        ],
        update: [
          {
            keys: {
              pk: 'ARTIFACT_TAG|user-1',
              sk: '01|react|true',
            },
            setAttributes: {
              count: 1,
            },
          },
        ],
      });
    });
  });

  describe('getItems', () => {
    test('with items', async () => {
      db.query.mockResolvedValue({
        items: [
          createArtifactEntity(),
          createArtifactEntity({
            sk: '01|artifact-2|true',
            gsi1Sk: '01|2026-03-16|artifact-2|true',
            gsi2Sk: '01|2026-03-16|artifact-2|true',
            artifactId: 'artifact-2',
            title: 'My title 2',
          }),
        ],
      });

      const result = await helper.getItems({ userId });

      expect(db.query).toHaveBeenCalledWith({
        indexName: 'GSI1',
        keyConditions: [
          {
            attribute: 'gsi1Pk',
            value: pk,
          },
        ],
      });
      expect(result).toStrictEqual([
        {
          artifactId,
          userId,
          title: 'My title',
          type: 'research',
          tags: ['tag-1', 'tag-2'],
          publishedAt,
          summary: 'summary',
          links,
          judgment: 'good',
          createdAt: '2026-03-15T10:00:00.000Z',
          updatedAt: '2026-03-15T10:00:00.000Z',
        },
        {
          artifactId: 'artifact-2',
          userId,
          title: 'My title 2',
          type: 'research',
          tags: ['tag-1', 'tag-2'],
          publishedAt,
          summary: 'summary',
          links,
          judgment: 'good',
          createdAt: '2026-03-15T10:00:00.000Z',
          updatedAt: '2026-03-15T10:00:00.000Z',
        },
      ]);
    });

    test('empty', async () => {
      db.query.mockResolvedValue({
        items: [],
      });

      const result = await helper.getItems({ userId });

      expect(result).toStrictEqual([]);
    });
  });
});
