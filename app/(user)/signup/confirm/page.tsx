import Link from 'next/link';
import { signUpCredentialKey } from '@/definitions';
import { createCookieManager } from '@/server/createCookieManager';
import type { AuthCredential } from '../../types';
import { Form } from './Form';

export default async function SignupConfirmPage() {
  const { getCookie } = await createCookieManager();
  const cachedUser = getCookie(signUpCredentialKey);
  const shouldNotHappen = (
    <div className="text-center">
      Something is wrong,
      <Link href="/signup" className="text-accent ml-2 underline">
        Go back to sign up page
      </Link>
    </div>
  );

  if (!cachedUser) {
    return shouldNotHappen;
  }

  let credential: AuthCredential;
  try {
    credential = JSON.parse(cachedUser);
    if (!credential.email || !credential.from || !credential.password) {
      return shouldNotHappen;
    }
  } catch {
    return shouldNotHappen;
  }

  return (
    <div className="mx-auto my-10 max-w-lg px-4">
      <Link href="/signup">&lt; back</Link>
      <h1 className="mt-10 mb-5 text-center text-3xl font-bold">
        Confirm Your Email
      </h1>
      <div className="text-center">
        Please enter the verification code sent to email: {credential.email}
      </div>

      <Form credential={credential} />
    </div>
  );
}
