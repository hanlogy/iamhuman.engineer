import {
  CognitoHelper,
  CognitoHelperInterface,
  FakeCognitoHelper,
} from '@hanlogy/ts-cognito';

export function getCognitoHelper(): CognitoHelperInterface {
  return process.env.NODE_ENV !== 'development'
    ? new CognitoHelper()
    : new FakeCognitoHelper();
}
