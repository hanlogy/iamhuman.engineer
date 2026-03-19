export const GIT_HUB_URL = 'https://github.com/iamhuman-engineer/community';
export const S3_PUBLIC_BASE_URL = 'https://192.168.10.238:9150/upload';
export const USER_TO_CONFIRM_KEY = 'user_to_confirm';
export const FORGOT_PASSWORD_KEY = 'forgot_password_email';
export const SESSION_KEY = 'session';

export const ARTIFACT_TYPES = [
  'code',
  'package',
  'product',
  'design',
  'case-study',
  'research',
  'knowledge',
] as const;

/**
 * in seconds
 */
export const SESSION_AGE = 30 * 24 * 60 * 60;
