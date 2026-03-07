'use client';

import { useRef, useState, type SubmitEvent } from 'react';
import { useForm } from '@hanlogy/react-web-ui';
import { FilledButton } from '@/components/buttons/FilledButton';
import { FormErrorMessage } from '@/components/form/FormErrorMessage';
import { VCodeField } from '@/components/form/fields';
import { confirmSignUp, resendSignUpConfirmationCode } from './action';

interface FormData {
  code: string;
}

export function Form({
  user: { email },
}: {
  user: {
    email: string;
  };
}) {
  const { register, validate, getValues, setFormErrorListener, setFormError } =
    useForm<FormData>();

  const [isPending, setIsPending] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleVerify = async (e: SubmitEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }
    const values = getValues();

    setIsPending(true);

    const { error } = await confirmSignUp({
      email,
      code: values.code,
    });

    setIsPending(false);

    if (error) {
      switch (error.code) {
        case 'codeMismatch':
          return setFormError('Verification code does not match.');
        case 'limitExceeded':
          return setFormError(
            'Attempt limit exceeded, please try after some time.'
          );
        default:
          return setFormError('Failed to verify, please try again.');
      }
    }
  };

  const startCountdown = () => {
    if (intervalRef.current != null) {
      return;
    }

    setCountdown(60);
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
  };

  const resetCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setCountdown(0);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) {
      return;
    }
    startCountdown();
    setResendError(null);

    const { error } = await resendSignUpConfirmationCode({ email });
    if (error) {
      setResendError(
        'Failed to resend verification code, please try again later.'
      );
      resetCountdown();
    }
  };

  return (
    <>
      <form onSubmit={handleVerify} className="mt-6 text-center">
        <div className="mx-auto w-60">
          <VCodeField
            controller={register('code', {
              validator: ({ code }) => {
                if (!code) {
                  return 'Please enter verification code';
                }
              },
            })}
            disabled={isPending}
            maxLength={6}
            placeholder="Verification Code"
          />
        </div>
        <div className="mx-auto mt-6 mb-2 w-46">
          <FilledButton type="submit" size="medium" disabled={isPending}>
            {isPending ? 'Verifying' : 'Verify'}
          </FilledButton>
        </div>
        <FormErrorMessage setListener={setFormErrorListener} />
      </form>

      <div className="my-10 text-center">
        {countdown > 0 ? (
          <span className="text-foreground">
            Verification code sent again. You can resend in {countdown} seconds.
          </span>
        ) : (
          <>
            <span className="text-foreground">
              Didn&apos;t receive the code?
            </span>{' '}
            <button className="text-brand font-semibold" onClick={handleResend}>
              Resend
            </button>
          </>
        )}
        {resendError && <div className="mt-2 text-red-600">{resendError}</div>}
      </div>
    </>
  );
}
