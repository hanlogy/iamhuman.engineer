'use client';

import { useRef, useState, type SubmitEvent } from 'react';
import { useForm } from '@hanlogy/react-web-ui';
import { FilledButton } from '@/components/buttons/FilledButton';
import { FormErrorMessage } from '@/components/form/FormErrorMessage';
import { VCodeField } from '@/components/form/fields';
import { resendSignUpConfirmationCode } from './action';

interface FormData {
  code: string;
}

export function Form({
  user,
}: {
  user: {
    email: string;
  };
}) {
  const { register, validate, setFormErrorListener } = useForm<FormData>();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleVerify = (e: SubmitEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
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

    const { error } = await resendSignUpConfirmationCode({ email: user.email });
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
            disabled={isVerifying}
            maxLength={6}
            placeholder="Verification Code"
          />
        </div>
        <div className="mx-auto mt-6 mb-2 w-46">
          <FilledButton type="submit" size="medium" disabled={isVerifying}>
            {isVerifying ? 'Verifying' : 'Verify'}
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
