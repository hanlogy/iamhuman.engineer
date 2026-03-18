'use client';

import { useState, type SubmitEvent } from 'react';
import { useForm } from '@hanlogy/react-web-ui';
import Link from 'next/link';
import { forgotPassword } from '@/actions/user/forgotPassword';
import { FilledButton } from '@/components/buttons/FilledButton';
import { FormErrorMessage } from '@/components/form/FormErrorMessage';
import { EmailField } from '@/components/form/fields';

export default function ForgotPassword() {
  const [isWaiting, setIsWaiting] = useState(false);

  const {
    register,
    validate,
    getValues,
    setFormError,
    setFieldError,
    setFormErrorListener,
  } = useForm<{
    email: string;
  }>();

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const { email } = getValues();
    if (!email) {
      return;
    }

    setIsWaiting(true);
    const saveResult = await forgotPassword({ email });

    setIsWaiting(false);

    if (saveResult.error) {
      switch (saveResult.error.code) {
        case 'userNotFound':
          setFieldError('email', 'No account found with this email');
          return;
        default:
          setFormError('Unknown Error!');
          return;
      }
    }
  };

  return (
    <>
      <h1 className="my-8 text-center text-2xl font-semibold">
        Forgot Password
      </h1>
      <form onSubmit={onSubmit} className="mx-auto max-w-md">
        <div className="mb-6">
          <EmailField
            controller={register('email', {
              validator: ({ email }) => {
                if (!email || email.length < 6) {
                  return 'Please enter a valid email';
                }
              },
            })}
            label="Email"
            placeholder="Enter your email"
          />
        </div>
        <div className="mx-auto mb-2 w-60 text-center">
          <FilledButton type="submit" size="medium" disabled={isWaiting}>
            Reset password
          </FilledButton>
        </div>
        <FormErrorMessage setListener={setFormErrorListener} />
        <div className="my-14 text-center">
          <Link href="/login" className="text-brand mr-5 hover:underline">
            Login
          </Link>
          |
          <Link href="/signup" className="text-brand ml-5 hover:underline">
            Sign Up
          </Link>
        </div>
      </form>
    </>
  );
}
