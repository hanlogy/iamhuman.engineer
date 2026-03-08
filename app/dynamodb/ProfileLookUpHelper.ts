import { randomUUID } from 'crypto';
import { HelperBase } from './HelperBase';
import { ProfileHelper } from './ProfileHelper';

export class ProfileLookUpHelper extends HelperBase {
  private buildPk({ userId }: { userId: string }) {
    return this.db.buildKey('user', userId);
  }

  private buildSk() {
    return this.db.buildKey('01', 'profile', true);
  }

  private buildKeys({ userId }: { userId: string }) {
    return { pk: this.buildPk({ userId }), sk: this.buildSk() };
  }

  private get profileHelper() {
    return this.createHelper(ProfileHelper);
  }

  async getHandleByUserId(userId: string): Promise<string> {
    const { item } = await this.db.get({ keys: this.buildKeys({ userId }) });

    if (item) {
      return item.handle;
    }

    // Create default profile
    const handle = randomUUID();

    await this.db.transactWrite({
      put: [
        {
          keyNames: ['pk', 'sk'],
          item: {
            ...this.profileHelper.buildKeys({ handle }),
            handle,
            userId,
          },
        },
        {
          keyNames: ['pk', 'sk'],
          item: {
            ...this.buildKeys({ userId }),
            handle,
            userId,
          },
        },
      ],
    });

    return handle;
  }
}
