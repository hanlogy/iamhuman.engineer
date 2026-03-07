'use client';

import { type SubmitEvent } from 'react';
import { useForm } from '@hanlogy/react-web-ui';
import Link from 'next/link';
import { FilledButton } from '@/components/buttons/FilledButton';
import { FormErrorMessage } from '@/components/form/FormErrorMessage';
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
  const {
    register,
    validate,
    getValues,
    setFieldError,
    setFormError,
    setFormErrorListener,
  } = useForm<FormData>();

  const handleSignup = async (e: SubmitEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const values = getValues();

    const { error } = await signup(values);

    if (error) {
      switch (error.code) {
        case 'usernameExists':
          setFieldError('email', 'An account with this email already exists');
          return;
        case 'invalidPassword':
          setFieldError('password', 'Invalid password');
          return;
      }

      setFormError('Unknown error');
      return;
    }
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
      <form className="flex flex-col" onSubmit={handleSignup}>
        <div className="mb-12 space-y-6">
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
            helper="At least 8 characters, including uppercase letters, numbers, and symbols."
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
        </div>

        <FormErrorMessage className="mb-2" setListener={setFormErrorListener} />
        <FilledButton type="submit">Create account</FilledButton>
      </form>
    </div>
  );
}
