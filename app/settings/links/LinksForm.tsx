'use client';

import { useState } from 'react';
import { Button, IconButton, TextInput } from '@hanlogy/react-web-ui';
import { saveLinks } from '@/actions/settings/saveLinks';
import { ErrorMessage } from '@/components/ErrorMessage';
import { FilledButton } from '@/components/buttons/FilledButton';
import { inputClass } from '@/components/form/common';
import { DeleteSvg, Link2Svg } from '@/components/svgs';

interface Link {
  id: string;
  url: string;
}

export function LinksForm({ links: defaultLinks }: { links: Link[] }) {
  const [links, setLinks] = useState<Link[]>(defaultLinks);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const inputClassName = inputClass();
  const handleAdd = () => {
    setLinks((p) => {
      return [
        ...p,
        {
          id: crypto.randomUUID(),
          url: '',
        },
      ];
    });
  };

  const handleDelete = (id: string) => {
    setLinks((p) => p.filter((e) => e.id != id));
  };

  const handleOnChange = (id: string, url: string) => {
    return setLinks((p) =>
      p.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            url,
          };
        }
        return item;
      })
    );
  };

  const handleSave = async () => {
    setError('');
    setIsPending(true);

    const saveResult = await saveLinks({
      links: links.map(({ url }) => url).filter((e) => !!e.trim()),
    });

    setIsPending(false);

    if (saveResult.error) {
      setError('Unknown error');
      return;
    }

    window.location.reload();
  };

  return (
    <>
      <form className="space-y-6">
        {links.map(({ id, url }) => {
          return (
            <div key={id} className="flex items-center">
              <div className="flex flex-1 items-center">
                <Link2Svg className="text-foreground-muted mr-2 w-6" />
                <div className="flex-1">
                  <TextInput
                    name={id}
                    onChange={(e) => handleOnChange(id, e.currentTarget.value)}
                    placeholder="URL or email"
                    defaultValue={url}
                    className={inputClassName}
                  />
                </div>
              </div>
              {links.length > 1 && (
                <IconButton
                  onClick={() => {
                    handleDelete(id);
                  }}
                  size="xsmall"
                  className="text-foreground-muted"
                >
                  <DeleteSvg className="w-5" />
                </IconButton>
              )}
            </div>
          );
        })}
        <div className="text-center">
          <Button
            onClick={() => handleAdd()}
            className="border-border text-foreground-secondary hover:bg-surface-secondary border"
            size="xsmall"
          >
            Add one more link
          </Button>
        </div>
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
