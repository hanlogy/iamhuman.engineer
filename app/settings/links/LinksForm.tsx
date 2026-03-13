'use client';

import { useState } from 'react';
import { TextInput } from '@hanlogy/react-web-ui';
import { FilledButton } from '@/components/buttons/FilledButton';
import { inputClass } from '@/components/form/common';
import { Link2Svg } from '@/components/svgs';

export function LinksForm() {
  const inputClassName = inputClass();
  const [links] = useState<string[]>(Array(5).fill(''));

  return (
    <>
      <div className="text-foreground-muted pb-6 text-center text-lg">
        Links or public email
      </div>
      <form className="space-y-6">
        {links.map((link, index) => {
          return (
            <div key={index} className="flex items-center">
              <Link2Svg className="text-foreground-muted mr-2 w-6" />
              <div className="flex-1">
                <TextInput defaultValue={link} className={inputClassName} />
              </div>
            </div>
          );
        })}
        <div className="py-5 text-center">
          <FilledButton className="min-w-40" size="small">
            Save
          </FilledButton>
        </div>
      </form>
    </>
  );
}
