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
  const { register, validate, getValues } = useForm<FormData>();
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
      setError(saveResult.error.message ?? 'Unknown error');
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
