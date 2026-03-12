'use client';

import { useState } from 'react';
import { useForm } from '@hanlogy/react-web-ui';
import { FilledButton } from '@/components/buttons/FilledButton';
import { TextField } from '@/components/form/fields';
import { useSettingsContext } from '../../state/hooks';

interface FormData {
  name: string;
  handle: string;
  location: string;
}

export function ProfileForm() {
  const { register } = useForm<FormData>();
  const { handle: defaultHandle, host } = useSettingsContext();
  const [handle, setHandle] = useState(defaultHandle ?? '');

  return (
    <>
      <div className="bg-surface-secondary mx-auto h-26 w-26 rounded-full"></div>
      <form className="space-y-6">
        <TextField label="Name" controller={register('name')} />
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
        <TextField label="Location" controller={register('location')} />

        <div className="py-5 text-center">
          <FilledButton size="small">Save</FilledButton>
        </div>
      </form>
    </>
  );
}
