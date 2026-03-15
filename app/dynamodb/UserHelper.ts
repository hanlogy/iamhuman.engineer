import type { AttributeValueRecord } from '@hanlogy/ts-dynamodb';
import { randomBytes } from 'node:crypto';
import type { UserSummary } from '@/definitions';
import { HelperBase } from './HelperBase';
import { ProfileHelper } from './ProfileHelper';

export class UserHelper extends HelperBase {
  private buildPk({ userId }: { userId: string }) {
    return this.db.buildKey('user', userId);
  }

  private buildSk() {
    return this.db.buildKey('01', 'profile', true);
  }

  buildKeys({ userId }: { userId: string }) {
    return { pk: this.buildPk({ userId }), sk: this.buildSk() };
  }

  private get profileHelper() {
    return this.createHelper(ProfileHelper);
  }

  async get(userId: string): Promise<AttributeValueRecord | undefined> {
    const { item } = await this.db.get({ keys: this.buildKeys({ userId }) });

    return item;
  }

  async getOrCreateSummary(userId: string): Promise<UserSummary> {
    const item = await this.get(userId);

    if (item) {
      const { handle } = item;
      const profileHelper = this.createHelper(ProfileHelper);
      const profile = await profileHelper.get(handle);
      let avatar: string | undefined = undefined;

      if (profile) {
        avatar = profile.avatar;
      }

      return { handle, userId, avatar };
    }

    const handle = randomBytes(8).toString('hex');

    const itemCommon = {
      handle,
      userId,
    };

    await this.db.transactWrite({
      put: [
        {
          keyNames: ['pk', 'sk'],
          item: {
            ...this.profileHelper.buildKeys({ handle }),
            ...itemCommon,
          },
          conditions: [
            { attribute: 'pk', operator: 'not_exists' },
            { attribute: 'sk', operator: 'not_exists' },
          ],
        },
        {
          keyNames: ['pk', 'sk'],
          item: {
            ...this.buildKeys({ userId }),
            ...itemCommon,
          },
          conditions: [
            { attribute: 'pk', operator: 'not_exists' },
            { attribute: 'sk', operator: 'not_exists' },
          ],
        },
      ],
    });

    return itemCommon;
  }
}
