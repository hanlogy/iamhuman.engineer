import type { AttributeValueRecord } from '@hanlogy/ts-dynamodb';
import { randomBytes } from 'node:crypto';
import { HelperBase } from './HelperBase';
import { ProfileHelper } from './ProfileHelper';

export class ProfileLookUpHelper extends HelperBase {
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

  async getHandleByUserId(userId: string): Promise<string> {
    const item = await this.get(userId);

    if (item) {
      return item.handle;
    }

    const handle = randomBytes(8).toString('hex');

    await this.db.transactWrite({
      put: [
        {
          keyNames: ['pk', 'sk'],
          item: {
            ...this.profileHelper.buildKeys({ handle }),
            handle,
            userId,
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
            handle,
            userId,
          },
          conditions: [
            { attribute: 'pk', operator: 'not_exists' },
            { attribute: 'sk', operator: 'not_exists' },
          ],
        },
      ],
    });

    return handle;
  }
}
