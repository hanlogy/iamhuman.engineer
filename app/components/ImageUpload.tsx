'use client';

import { useState } from 'react';
import { Button, clsx } from '@hanlogy/react-web-ui';
import Image from 'next/image';
import { ErrorMessage } from './ErrorMessage';
import { SelectFileButton } from './SelectFileButton';

export function ImageUpload({
  style,
  defaultImage,
  onChange,
}: {
  style: 'rounded' | 'square';
  defaultImage?: string;
  onChange: (opts: { isDelete: boolean; newImage?: string }) => void;
}) {
  const [image, setImage] = useState<string | null>(defaultImage || null);
  const [error, setError] = useState('');

  const handleFileSelect = (file: File) => {
    if (file.size > 1048576) {
      setError('File size must not exceed 1MB.');
      return;
    }
    setError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const newImage = e.target.result as string;
        setImage(newImage);
        onChange({
          isDelete: false,
          newImage,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = () => {
    setImage(null);
    onChange({
      isDelete: true,
    });
  };

  const handleRest = () => {
    setImage(defaultImage ?? '');
    onChange({
      isDelete: false,
    });
  };

  const selectButtonLabel = image ? 'Change' : 'Select';

  return (
    <div className="flex flex-col items-center">
      <div
        className={clsx('bg-surface-secondary h-26 w-26 overflow-clip', {
          'rounded-full': style === 'rounded',
          'rounded-xl': style === 'square',
        })}
      >
        {image && (
          <Image
            src={image}
            width={100}
            height={100}
            alt="Preview"
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="mt-4 space-x-2 text-center">
        {defaultImage && (
          <Button
            onClick={handleDelete}
            size="xsmall"
            className="border-border border"
          >
            Delete
          </Button>
        )}
        {image && (
          <Button
            onClick={handleRest}
            size="xsmall"
            className="border-border border"
          >
            Reset
          </Button>
        )}

        <SelectFileButton
          type="image"
          label={selectButtonLabel}
          onChange={handleFileSelect}
        />
      </div>
      <ErrorMessage className="mt-2" message={error} />
    </div>
  );
}
