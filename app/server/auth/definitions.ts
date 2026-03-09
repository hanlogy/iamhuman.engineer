export interface SetSessionParams {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
}

export interface SessionPayload {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresAt: number;
}

export const sessionAgeInSeconds = 30 * 24 * 60 * 60;
