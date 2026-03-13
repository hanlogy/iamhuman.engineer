'use client';

import { useState } from 'react';
import { useForm } from '@hanlogy/react-web-ui';
import { saveProfile } from '@/actions/settings/saveProfile';
import { ErrorMessage } from '@/components/ErrorMessage';
import { ImageUpload } from '@/components/ImageUpload/ImageUpload';
import { useImageUploadContext } from '@/components/ImageUpload/hooks';
import { FilledButton } from '@/components/buttons/FilledButton';
import { TextField } from '@/components/form/fields';
import type { Profile } from '@/definitions/types';
import { useAppContext } from '@/state/hooks';

interface FormData {
  name: string;
  handle: string;
  location: string;
}

export function ProfileForm({
  profile: {
    handle: defaultHandle,
    name: defaultName,
    location: defaultLocation,
  },
}: {
  profile: Profile;
}) {
  const { register, validate, getValues, setFieldError } = useForm<FormData>();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [handle, setHandle] = useState(defaultHandle);
  const { host } = useAppContext();
  const { resolveImage } = useImageUploadContext();

  const handleSave = async () => {
    setError('');
    if (!validate()) {
      return;
    }

    setIsPending(true);
    const uodImage = await resolveImage();
    if (!uodImage) {
      return;
    }

    const values = getValues();
    const saveResult = await saveProfile({
      ...values,
      uodImage,
    });

    setIsPending(false);

    if (saveResult.error) {
      const errorMessage = saveResult.error.message ?? 'Unknown error';
      if (
        saveResult.error.code === 'handleExists' ||
        saveResult.error.code === 'handleUnavailable'
      ) {
        setFieldError('handle', errorMessage);
      } else {
        setError(errorMessage);
      }
      return;
    }

    window.location.reload();
  };

  return (
    <>
      <ImageUpload style="rounded" />
      <form className="space-y-6">
        <TextField
          defaultValue={defaultName}
          label="Name"
          controller={register('name', {
            validator: ({ name }) => {
              if (!name?.trim()) {
                return "Name can't be empty";
              }
            },
          })}
        />
        <TextField
          helper={`${host}/${handle}`}
          defaultValue={handle}
          label="Handle"
          controller={register('handle', {
            onValueChange: ({ handle }) => {
              setHandle(handle ?? '');
            },
            validator: ({ handle }) => {
              if (!handle || handle.length < 3) {
                return 'Invalid handle';
              }
              if (!/^[a-z0-9_.-]+$/i.test(handle)) {
                return 'Invalid handle';
              }
            },
          })}
        />
        <TextField
          defaultValue={defaultLocation}
          label="Location"
          controller={register('location')}
        />

        <div className="py-5 text-center">
          <FilledButton
            disabled={isPending}
            onClick={() => handleSave()}
            className="min-w-40"
            size="small"
          >
            Save
          </FilledButton>
        </div>
      </form>
      <ErrorMessage message={error} />
    </>
  );
}
