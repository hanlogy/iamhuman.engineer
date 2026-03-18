'use client';

import { useState, type SubmitEvent } from 'react';
import { useForm } from '@hanlogy/react-web-ui';
import Link from 'next/link';
import { confirmForgotPassword } from '@/actions/user/confirmForgotPassword';
import { FilledButton } from '@/components/buttons/FilledButton';
import { FormErrorMessage } from '@/components/form/FormErrorMessage';
import { PasswordField, TextField } from '@/components/form/fields';

interface FormData {
  code: string;
  password: string;
  confirmPassword: string;
}

export default function ConfirmForm({ email }: { email: string }) {
  const [isWaiting, setIsWaiting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    setFormErrorListener,
    getValues,
    setFieldError,
    setFormError,
    validate,
  } = useForm<FormData>();

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="mt-10 mb-5">
          Your password has been reset successfully.
        </div>
        <Link href="/login" className="text-brand mr-5 hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  const handleChangePassword = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const { code, password, confirmPassword } = getValues();
    if (!code || !password || !confirmPassword) {
      return;
    }

    setIsWaiting(true);
    const saveResult = await confirmForgotPassword({ email, password, code });
    setIsWaiting(false);

    if (!saveResult.error) {
      setIsSuccess(true);
      return;
    }

    switch (saveResult.error.code) {
      case 'userNotFound':
        setFormError('No account found with this email');
        return;
      case 'expiredCode':
        setFieldError('code', 'The verification code has expired');
        return;
      case 'invalidPassword':
        setFieldError('password', 'The new password is not valid');
        return;
      case 'codeMismatch':
        setFieldError('code', 'The verification code does not match');
        return;
      default:
        setFormError('Could not reset password. Please try again later.');
        return;
    }
  };

  return (
    <>
      <h1 className="mt-10 mb-5 text-center text-3xl font-semibold">
        Reset Your Password
      </h1>
      <div className="text-center">
        Enter the verification code sent to your email, then create a new
        password.
      </div>
      <form onSubmit={handleChangePassword} className="mx-auto mt-6 max-w-md">
        <div className="mb-8 flex flex-col space-y-6">
          <TextField
            label="Verification Code"
            maxLength={6}
            type="number"
            controller={register('code', {
              validator: ({ code }) => {
                if (!code) {
                  return 'Please enter verification code';
                }
              },
            })}
          />
          <PasswordField
            label="New Password"
            controller={register('password', {
              validator: ({ password }) => {
                if (!password) {
                  return 'Please enter your new password';
                }
              },
            })}
          />
          <PasswordField
            label="Confirm New Password"
            controller={register('confirmPassword', {
              validator: ({ password, confirmPassword }) => {
                if (!confirmPassword) {
                  return 'Please enter the new password again';
                }
                if (password && password !== confirmPassword) {
                  return 'Confirm password does not match';
                }
              },
            })}
          />
        </div>
        <FormErrorMessage setListener={setFormErrorListener} />
        <div className="mt-6 text-center">
          <FilledButton disabled={isWaiting} size="medium" type="submit">
            Save new password
          </FilledButton>
        </div>
      </form>
    </>
  );
}
