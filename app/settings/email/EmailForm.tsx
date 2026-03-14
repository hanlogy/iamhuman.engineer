'use client';

import { useState } from 'react';
import { GetCodeForm } from './GetCodeForm';
import { VerifyForm } from './VerifyForm';

export function EmailForm() {
  const [email, setEmail] = useState<string>('');
  const [isSucccess, setIsSUccess] = useState<boolean>(false);

  if (isSucccess) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-lg font-semibold">Success</div>
        <div>Your new email is: {email}</div>
      </div>
    );
  }

  if (!email) {
    return <GetCodeForm onSuccess={setEmail} />;
  }

  if (email) {
    return <VerifyForm onSuccess={() => setIsSUccess(true)} email={email} />;
  }
}
