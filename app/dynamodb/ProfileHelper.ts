import type { UODImage } from '@/components/ImageUpload';
import type { Profile } from '@/definitions/types';
import { reservedPaths } from '@/lib/reservedPaths';
import { HelperBase } from './HelperBase';
import { UserHelper } from './UserHelper';
import { DBHelperError, type ProfileEntity } from './types';

export class ProfileHelper extends HelperBase {
  private readonly sk = '01#';

  private buildPk({ handle }: { handle: string }) {
    return this.db.buildKey('profile', handle);
  }

  buildKeys({ handle }: { handle: string }) {
    return { pk: this.buildPk({ handle }), sk: this.sk };
  }

  async get(handleLike: string): Promise<ProfileEntity | undefined> {
    const { item } = await this.db.get({
      keys: this.buildKeys({ handle: handleLike }),
    });

    if (!item) {
      return undefined;
    }

    const {
      pk,
      sk,
      userId,
      handle,
      name,
      avatar,
      status,
      links,
      location,
      createdAt,
      updatedAt,
    } = item;

    return {
      pk,
      sk,
      userId,
      handle,
      name,
      avatar,
      status,
      links,
      location,
      createdAt,
      updatedAt,
    };
  }

  async getItem({
    handle: handleLike,
  }: {
    handle: string;
  }): Promise<Profile | undefined> {
    const item = await this.get(handleLike);
    if (!item) {
      return undefined;
    }
    const {
      pk: _pk,
      sk: _sk,
      updatedAt: _updatedAt,
      createdAt: _createdAt,
      ...rest
    } = item;

    return rest;
  }

  async saveLinks({ handle, links }: { handle: string; links: string[] }) {
    await this.db.update({
      keys: this.buildKeys({ handle }),
      setAttributes: { links },
    });
  }

  async saveProfile(
    userId: string,
    {
      name,
      handle,
      location,
      uodImage,
    }: {
      name: string;
      handle: string;
      location?: string;
      uodImage: UODImage;
    }
    //
  ): Promise<{
    changed: {
      handle?: string;
      avatar?: string;
    };
  }> {
    const userHelper = this.createHelper(UserHelper);
    const userSummary = await userHelper.get(userId);
    if (!userSummary) {
      throw new Error('User not found');
    }
    handle = handle.trim();
    const changed: {
      handle?: string;
      avatar?: string;
    } = {};
    let isHandleChanged: boolean = false;
    if (userSummary.handle.toLowerCase() !== handle.toLowerCase()) {
      if (reservedPaths.includes(handle.toLowerCase()) || handle.length < 3) {
        throw new DBHelperError({
          code: 'handleUnavailable',
          message: 'This handle is not avaliable..',
        });
      }

      if (await this.get(handle)) {
        throw new DBHelperError({
          code: 'handleExists',
          message: 'This handle already exists.',
        });
      }

      isHandleChanged = true;
    }

    const newFields = {
      ...(name ? { name } : {}),
      ...(location ? { location } : {}),
      ...(uodImage.isDelete ? { avatar: '' } : {}),
      ...(uodImage.newKey ? { avatar: uodImage.newKey } : {}),
    };

    if (uodImage && (uodImage.isDelete || uodImage.newKey)) {
      changed.avatar = newFields.avatar;
    }

    if (isHandleChanged) {
      changed.handle = handle;
      const {
        pk: _pk,
        sk: _sk,
        updatedAt: _updatedAt,
        ...oldEntity
      } = (await this.get(userSummary.handle)) ?? {};
      await this.db.transactWrite({
        update: [
          {
            keys: userHelper.buildKeys({ userId }),
            setAttributes: { handle },
          },
        ],
        put: [
          {
            keyNames: ['pk', 'sk'],
            item: {
              ...this.buildKeys({ handle }),
              ...oldEntity,
              ...newFields,
              handle,
            },
          },
        ],
        delete: [{ keys: this.buildKeys({ handle: userSummary.handle }) }],
      });
    } else {
      await this.db.update({
        keys: this.buildKeys({ handle }),
        setAttributes: newFields,
      });
    }

    return { changed };
  }
}
