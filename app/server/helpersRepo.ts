import {
  CognitoHelper,
  type CognitoHelperInterface,
  FakeCognitoHelper,
} from '@hanlogy/ts-cognito';
import { FakeS3ServerHelper, S3ServerHelper } from '@/lib/s3';
import type { S3HelperInterface } from '@/lib/s3/type';

export function getCognitoHelper(): CognitoHelperInterface {
  return process.env.NODE_ENV !== 'development'
    ? new CognitoHelper()
    : new FakeCognitoHelper();
}

export function getS3Helper(): S3HelperInterface {
  return process.env.NODE_ENV !== 'development'
    ? new S3ServerHelper()
    : new FakeS3ServerHelper();
}
