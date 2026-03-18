'use client';

import { useState, type SubmitEvent } from 'react';
import { useForm } from '@hanlogy/react-web-ui';
import { updateUserAttributes } from '@/actions/settings/updateUserAttributes';
import { ErrorMessage } from '@/components/ErrorMessage';
import { FilledButton } from '@/components/buttons/FilledButton';
import { TextField } from '@/components/form/fields';

interface FormData {
  email: string;
}

export function GetCodeForm({
  onSuccess,
}: {
  onSuccess: (email: string) => void;
}) {
  const { register, getValues, setFieldError } = useForm<FormData>();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const email = getValues().email;

    if (!email) {
      setFieldError('email', 'Enter your new email address');
      return;
    }
    setIsPending(true);

    const { error } = await updateUserAttributes({ email });
    setIsPending(false);
    if (error) {
      setError('Unknown error');
      return;
    }

    onSuccess(email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="relative">
          <TextField
            type="email"
            label="New email"
            controller={register('email')}
          />
        </div>
      </div>

      <div className="py-10 text-center">
        <FilledButton
          disabled={isPending}
          className="min-w-40 px-6"
          size="small"
          type="submit"
        >
          Get verification code
        </FilledButton>
      </div>
      <ErrorMessage message={error} />
    </form>
  );
}
