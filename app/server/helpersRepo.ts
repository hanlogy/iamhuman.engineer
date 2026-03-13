import {
  CognitoHelper,
  type CognitoHelperInterface,
  FakeCognitoHelper,
} from '@hanlogy/ts-cognito';
import { FakeS3Helper } from '@/lib/s3/FakeS3Helper';
import { S3Helper } from '@/lib/s3/S3Helper';
import type { S3HelperInterface } from '@/lib/s3/type';

export function getCognitoHelper(): CognitoHelperInterface {
  return process.env.NODE_ENV !== 'development'
    ? new CognitoHelper()
    : new FakeCognitoHelper();
}

export function getS3Helper(): S3HelperInterface {
  return process.env.NODE_ENV !== 'development'
    ? new S3Helper()
    : new FakeS3Helper();
}
