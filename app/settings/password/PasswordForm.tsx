'use client';

import { useState, type SubmitEvent } from 'react';
import { useForm } from '@hanlogy/react-web-ui';
import { changePassword } from '@/actions/settings/changePassword';
import { FilledButton } from '@/components/buttons/FilledButton';
import { FormErrorMessage } from '@/components/form/FormErrorMessage';
import { PasswordField } from '@/components/form/fields';

interface FormData {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export function PasswordForm() {
  const {
    register,
    validate,
    getValues,
    setFieldError,
    setFormError,
    setFormErrorListener,
  } = useForm<FormData>();

  const [isPending, setIsPending] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsPending(true);

    const { newPassword, oldPassword } = getValues();
    if (!newPassword || !oldPassword) {
      return;
    }

    const saveResult = await changePassword({
      newPassword,
      oldPassword,
    });

    setIsPending(false);

    if (saveResult.error) {
      switch (saveResult.error.code) {
        case 'notAuthorized':
          setFieldError('oldPassword', 'Current password is wrong');
          return;
        case 'invalidPassword':
          setFieldError('newPassword', 'New password is invalid');
          return;

        case 'limitExceeded':
          setFormError('Attempt limit exceeded, please try after some time');
          return;
      }

      setFormError('failed to change password');

      return;
    }

    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="py-12 text-center">
        <div className="font-semibold">
          Your password was changed successfully.
        </div>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <PasswordField
          label="Current password"
          controller={register('oldPassword', {
            validator: ({ oldPassword }) => {
              if (!oldPassword) {
                return 'Enter your current password';
              }
            },
          })}
        />

        <PasswordField
          label="New password"
          controller={register('newPassword', {
            validator: ({ newPassword }) => {
              if (!newPassword) {
                return 'Enter your new password';
              }
            },
          })}
        />
        <PasswordField
          label="Confirm new password"
          controller={register('confirmNewPassword', {
            validator: ({ newPassword, confirmNewPassword }) => {
              if (!confirmNewPassword) {
                return 'Confirm your new password';
              }
              if (newPassword && newPassword !== confirmNewPassword) {
                return 'Confirm password does not match';
              }
            },
          })}
        />

        <div className="py-5 text-center">
          <FilledButton
            disabled={isPending}
            type="submit"
            className="min-w-40"
            size="small"
          >
            Save
          </FilledButton>
        </div>
      </form>
      <FormErrorMessage setListener={setFormErrorListener} />
    </>
  );
}
