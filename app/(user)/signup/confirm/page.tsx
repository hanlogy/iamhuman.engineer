import Link from 'next/link';
import { signUpUserKey } from '@/definitions';
import { createCookieManager } from '@/server/createCookieManager';
import { Form } from './Form';

export default async function SignupConfirmPage() {
  const { getCookie } = await createCookieManager();
  const cachedUser = getCookie(signUpUserKey);
  const shouldNotHappen = (
    <div className="text-center">
      Something is wrong,{' '}
      <Link href="/signup" className="text-accent underline">
        Go back to sign up page
      </Link>
    </div>
  );

  if (!cachedUser) {
    return shouldNotHappen;
  }

  let user: {
    email: string;
  };
  try {
    user = JSON.parse(cachedUser);
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
        Please enter the verification code sent to email: {user.email}
      </div>

      <Form user={user} />
    </div>
  );
}
