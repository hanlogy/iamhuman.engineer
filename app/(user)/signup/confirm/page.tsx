'use client';

import { useRef, useState, type SubmitEvent } from 'react';
import { useForm } from '@hanlogy/react-web-ui';
import Link from 'next/link';
import { FilledButton } from '@/components/buttons/FilledButton';
import { FormErrorMessage } from '@/components/form/FormErrorMessage';
import { TextField } from '@/components/form/fields';

interface FormData {
  code: string;
}

export default function SignupConfirmPage() {
  const { register, setFormErrorListener } = useForm<FormData>();
  const [countdown, setCountdown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleVerify = (e: SubmitEvent) => {
    e.preventDefault();
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

    try {
      //
    } catch {
      resetCountdown();
    }
  };

  return (
    <div className="mx-auto my-10 max-w-lg px-4">
      <Link href="/signup">&lt; back</Link>
      <h1 className="mt-10 mb-5 text-center text-3xl font-bold">
        Confirm Your Email
      </h1>
      <div className="text-center">
        Please enter the verification code sent to your email: xxx@xx.xx
      </div>

      <form onSubmit={handleVerify} className="mt-6 text-center">
        <div className="mx-auto w-60">
          <TextField
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
          <span className="text-gray-600">
            Verification code sent again. You can resend in {countdown} seconds.
          </span>
        ) : (
          <>
            <span className="text-gray-600">Didn&apos;t receive the code?</span>{' '}
            <button className="text-brand font-semibold" onClick={handleResend}>
              Resend
            </button>
          </>
        )}
        {resendError && <div className="mt-2 text-red-600">{resendError}</div>}
      </div>
    </div>
  );
}
