import Link from 'next/link';
import { getUserToConfirm } from '@/server/confirmSignUpManager';
import { ConfirmSignUpForm } from './ConfirmSignUpForm';

export default async function SignupConfirmPage() {
  const shouldNotHappen = (
    <div className="text-center">
      Something is wrong,
      <Link href="/signup" className="text-accent ml-2 underline">
        Go back to sign up page
      </Link>
    </div>
  );

  const userToConfirm = await getUserToConfirm();
  if (!userToConfirm) {
    return shouldNotHappen;
  }

  return (
    <div className="mx-auto my-10 max-w-lg px-4">
      <Link href="/signup">&lt; back</Link>
      <h1 className="mt-10 mb-5 text-center text-3xl font-bold">
        Confirm Your Email
      </h1>
      <div className="text-center">
        Please enter the verification code sent to email: {userToConfirm.email}
      </div>

      <ConfirmSignUpForm userToConfirm={userToConfirm} />
    </div>
  );
}
