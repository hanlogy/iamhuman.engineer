'use client';

import { Button, useForm } from '@hanlogy/react-web-ui';
import { FilledButton } from '@/components/buttons/FilledButton';
import { TextField } from '@/components/form/fields';

interface FormData {
  email: string;
  code: string;
}

export function EmailForm() {
  const { register } = useForm<FormData>();

  return (
    <form>
      <div className="space-y-12">
        <div className="relative">
          <TextField
            type="email"
            label="New email"
            controller={register('email')}
          />
          <div className="absolute top-24 right-2 z-10">
            <Button
              size="small"
              className="bg-surface border-border cursor-pointer border"
            >
              Send code
            </Button>
          </div>
        </div>
        <TextField label="Verification code" controller={register('code')} />
      </div>

      <div className="py-5 text-center">
        <FilledButton size="small">Save</FilledButton>
      </div>
    </form>
  );
}
