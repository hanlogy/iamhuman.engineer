'use server';

import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';

export async function signup({
  email,
  password,
  region,
  name,
}: Partial<{
  email: string;
  password: string;
  region: string;
  name: string;
}>) {
  if (!email || !password || !region || !name) {
    return;
  }

  const client = new CognitoIdentityProviderClient({
    region: process.env.COGNITO_REGION,
  });

  const result = await client.send(
    new SignUpCommand({
      ClientId: process.env.USER_POOL_CLIENT_ID,
      Username: email,
      Password: password,
    })
  );

  // TODO: Create a profile for this user

  console.log(result);
}
