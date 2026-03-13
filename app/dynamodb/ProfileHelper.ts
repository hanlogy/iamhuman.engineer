import type { UODImage } from '@/components/ImageUpload';
import type { Profile } from '@/definitions/types';
import { reservedPaths } from '@/lib/reservedPaths';
import { HelperBase } from './HelperBase';
import { ProfileLookUpHelper } from './ProfileLookUpHelper';
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

    const { pk, sk, userId, handle, name, avatar, status, links, location } =
      item;

    return {
      pk,
      sk,
      userId,
      handle,
      name,
      avatar: avatar
        ? `${process.env.S3_PUBLIC_BASE_URL}/${avatar}`
        : undefined,
      status,
      links,
      location,
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
    const { pk: _pk, sk: _sk, ...rest } = item;

    return rest;
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
  ) {
    const lookupHelper = new ProfileLookUpHelper();
    const lookup = await lookupHelper.get(userId);
    if (!lookup) {
      throw new Error('User not found');
    }
    handle = handle.trim();
    let isHandleChanged: boolean = false;
    if (lookup.handle.toLowerCase() !== handle.toLowerCase()) {
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

    if (isHandleChanged) {
      const profile = await this.getItem({ handle });
      await this.db.transactWrite({
        update: [
          {
            keys: lookupHelper.buildKeys({ userId }),
            setAttributes: { handle },
          },
        ],
        put: [
          {
            keyNames: ['pk', 'sk'],
            item: {
              ...this.buildKeys({ handle }),
              handle,
              ...profile,
              ...newFields,
            },
          },
        ],
        delete: [{ keys: this.buildKeys({ handle: lookup.handle }) }],
      });
    } else {
      await this.db.update({
        keys: this.buildKeys({ handle }),
        setAttributes: newFields,
      });
    }
  }
}
