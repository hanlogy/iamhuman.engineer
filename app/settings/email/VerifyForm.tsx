'use client';

import { useState, type SubmitEvent } from 'react';
import { useForm } from '@hanlogy/react-web-ui';
import { verifyUserAttribute } from '@/actions/settings/verifyUserAttribute';
import { ErrorMessage } from '@/components/ErrorMessage';
import { FilledButton } from '@/components/buttons/FilledButton';
import { TextField } from '@/components/form/fields';

interface FormData {
  code: string;
}

export function VerifyForm({
  email,
  onSuccess,
}: {
  email: string;
  onSuccess: () => void;
}) {
  const { register, getValues, setFieldError } = useForm<FormData>();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: SubmitEvent) => {
    setError('');
    e.preventDefault();
    const code = getValues().code;

    if (!code) {
      setFieldError('code', 'Enter verification code');
      return;
    }
    setIsPending(true);

    const { error } = await verifyUserAttribute({ name: 'email', code });
    setIsPending(false);
    if (error) {
      switch (error.code) {
        case 'codeMismatch':
          setFieldError('code', 'The verification code does not match.');
          return;
        case 'aliasExists':
          setFieldError('code', 'This email already exists.');
          return;
      }

      setError('Unknown error');
      return;
    }

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 text-center">
        <div className="text-foreground-muted">
          A verification code was sent to:
        </div>
        <div className="mt-2 font-semibold">{email}</div>
      </div>
      <div className="space-y-12">
        <TextField
          label="Verification code"
          controller={register('code', {
            validator: ({ code }) => {
              if (!code?.trim()) {
                return 'Invalid code';
              }
            },
          })}
        />
      </div>

      <div className="py-5 text-center">
        <FilledButton
          className="min-w-40"
          size="small"
          type="submit"
          disabled={isPending}
        >
          Verify
        </FilledButton>
      </div>
      <ErrorMessage message={error} />
    </form>
  );
}
