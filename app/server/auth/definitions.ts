export interface SessionPayload {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresAt: number;
  readonly handle: string;
}

export const sessionAgeInSeconds = 30 * 24 * 60 * 60;
