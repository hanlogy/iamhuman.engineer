'use client';

import { useForm } from '@hanlogy/react-web-ui';
import { FilledButton } from '@/components/buttons/FilledButton';
import { PasswordField } from '@/components/form/fields';

interface FormData {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export function PasswordForm() {
  const { register } = useForm<FormData>();

  return (
    <>
      <form className="space-y-6">
        <PasswordField
          label="Current password"
          controller={register('oldPassword')}
        />

        <PasswordField
          label="New password"
          controller={register('newPassword')}
        />
        <PasswordField
          label="Confirm new password"
          controller={register('confirmNewPassword')}
        />

        <div className="py-5 text-center">
          <FilledButton className="min-w-40" size="small">
            Save
          </FilledButton>
        </div>
      </form>
    </>
  );
}
