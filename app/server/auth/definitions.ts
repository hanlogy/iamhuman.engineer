export interface SessionPayload {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly handle: string;
}

export const sessionAgeInSeconds = 30 * 24 * 60 * 60;
