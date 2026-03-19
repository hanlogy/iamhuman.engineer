import { randomUUID } from 'crypto';
import type { Session } from '@/definitions/types';
import { HelperBase } from './HelperBase';
import type { SessionEntity } from './types';

export class SessionHelper extends HelperBase {
  private readonly sk = '01#';

  private buildPk({ sessionId }: { sessionId: string }) {
    return this.db.buildKey('session', sessionId);
  }

  private buildKeys({ sessionId }: { sessionId: string }) {
    return { pk: this.buildPk({ sessionId }), sk: this.sk };
  }

  async get(sessionId: string): Promise<SessionEntity | undefined> {
    const { item } = await this.db.get({
      keys: this.buildKeys({ sessionId }),
    });

    if (!item) {
      return undefined;
    }

    const { pk, sk, userId, accessToken, refreshToken, expiresIn } = item;

    return { pk, sk, sessionId, userId, accessToken, refreshToken, expiresIn };
  }

  async getItem(sessionId: string): Promise<Session | undefined> {
    const entity = await this.get(sessionId);

    if (!entity) {
      return undefined;
    }

    const { pk: _pk, sk: _sk, ...session } = entity;

    return session;
  }

  async createItem({
    userId,
    accessToken,
    refreshToken,
    expiresIn,
  }: Omit<SessionEntity, 'pk' | 'sk' | 'sessionId'>): Promise<Session> {
    const sessionId = randomUUID();

    const session: Session = {
      sessionId,
      userId,
      accessToken,
      refreshToken,
      expiresIn,
    };

    await this.db.put({
      keyNames: ['pk', 'sk'],
      item: {
        ...this.buildKeys({ sessionId }),
        ...session,
      },
    });

    return session;
  }

  async deleteItem(sessionId: string): Promise<void> {
    await this.db.delete({
      keys: this.buildKeys({ sessionId }),
    });
  }
}
