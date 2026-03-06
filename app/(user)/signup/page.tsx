'use client';

import { useForm } from '@hanlogy/react-web-ui';
import Link from 'next/link';
import { FilledButton } from '@/components/buttons/FilledButton';
import {
  EmailField,
  PasswordField,
  SelectField,
  TextField,
} from '@/components/form/fields';

interface FormData {
  password: string;
  email: string;
  name: string;
  region: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const { register } = useForm<FormData>();

  return (
    <div className="mx-auto my-10 max-w-lg px-4">
      <div>
        <span className="mr-2">Already have an account?</span>
        <Link className="text-accent font-semibold underline" href="/login">
          Sign in
        </Link>
      </div>
      <h1 className="my-6 text-2xl font-semibold">
        Sign up for IAmHuman.Engineer
      </h1>
      <form className="flex flex-col space-y-6">
        <EmailField label="Email" controller={register('email')} />
        <PasswordField label="Password" controller={register('password')} />
        <PasswordField
          label="Confirm Password"
          controller={register('confirmPassword')}
        />
        <TextField label="Name" controller={register('name')} />
        <SelectField
          label="Your Country/Region"
          options={[]}
          controller={register('region')}
        ></SelectField>

        <FilledButton>Create account</FilledButton>
      </form>
    </div>
  );
}
