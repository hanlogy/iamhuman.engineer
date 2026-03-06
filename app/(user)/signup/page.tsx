'use client';

import { type SubmitEvent } from 'react';
import { useForm } from '@hanlogy/react-web-ui';
import Link from 'next/link';
import { FilledButton } from '@/components/buttons/FilledButton';
import {
  EmailField,
  PasswordField,
  RegionSelectField,
  TextField,
} from '@/components/form/fields';
import { signup } from './actions';

interface FormData {
  password: string;
  email: string;
  name: string;
  region: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const { register, validate, getValues } = useForm<FormData>();

  const handleSignup = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const values = getValues();

    await signup(values);
  };

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
      <form className="flex flex-col space-y-6" onSubmit={handleSignup}>
        <EmailField
          label="Email"
          controller={register('email', {
            validator: ({ email }) => {
              if (!email) {
                return 'Please enter your email';
              }
            },
          })}
        />
        <PasswordField
          label="Password"
          controller={register('password', {
            validator: ({ password }) => {
              if (!password) {
                return 'Please enter password';
              }
            },
          })}
        />
        <PasswordField
          label="Confirm Password"
          controller={register('confirmPassword', {
            validator: ({ password, confirmPassword }) => {
              if (!confirmPassword) {
                return 'Please enter your password again';
              }
              if (password && password !== confirmPassword) {
                return 'Confirm password does not match';
              }
            },
          })}
        />
        <TextField
          label="Name"
          controller={register('name', {
            validator: ({ name }) => {
              if (!name) {
                return 'Please enter your name';
              }
            },
          })}
        />
        <RegionSelectField
          label="Your Country/Region"
          controller={register('region', {
            validator: ({ region }) => {
              if (!region) {
                return 'Country/Region is required';
              }
            },
          })}
        />

        <FilledButton type="submit">Create account</FilledButton>
      </form>
    </div>
  );
}
