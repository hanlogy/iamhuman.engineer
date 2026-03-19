'use client';

import { type SubmitEvent } from 'react';
import { useForm } from '@hanlogy/react-web-ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '@/actions/user/login';
import { FilledButton } from '@/components/buttons/FilledButton';
import { FormErrorMessage } from '@/components/form/FormErrorMessage';
import { EmailField, PasswordField } from '@/components/form/fields';

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { register, validate, getValues, setFormError, setFormErrorListener } =
    useForm<FormData>();

  const handleSignup = async (e: SubmitEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const values = getValues();

    const { error, data } = await login(values);

    if (error) {
      switch (error.code) {
        case 'userNotConfirmed':
          router.push('/signup/confirm');
          return;
        case 'userNotFound':
        case 'notAuthorized':
          setFormError('Incorrect email or password');
          return;
      }

      setFormError('Unknown error');
      return;
    }

    router.push(`/${data.handle}`);
  };

  return (
    <div className="mx-auto my-10 max-w-lg px-4">
      <h1 className="my-6 text-center text-2xl font-semibold sm:my-8">
        Sign in to IAmHuman.Engineer
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
          <div>
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
            <div className="mt-4 text-right">
              <Link href="/forgot-password">Forgot password?</Link>
            </div>
          </div>
        </div>

        <FormErrorMessage className="mb-2" setListener={setFormErrorListener} />
        <FilledButton type="submit">Sign in</FilledButton>
      </form>
      <div className="mt-10 text-center">
        <span className="mr-2">New to IAmHuman.Engineer?</span>
        <Link className="text-accent font-semibold underline" href="/signup">
          Create an account
        </Link>
      </div>
    </div>
  );
}
