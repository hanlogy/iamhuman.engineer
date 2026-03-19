'use client';

import { Button, clsx } from '@hanlogy/react-web-ui';
import Image from 'next/image';
import { ErrorMessage } from '../ErrorMessage';
import { SelectFileButton } from '../SelectFileButton';
import { useImageUploadContext } from './hooks';
import type { ImageUploadStyle } from './types';

export function ImageUpload({ style }: { style: ImageUploadStyle }) {
  const {
    error,
    imageToPreview,
    canDelete,
    canReset,
    deleteImage,
    setImage,
    resetImage,
  } = useImageUploadContext();

  const selectButtonLabel = imageToPreview ? 'Change' : 'Select';

  return (
    <>
      <div
        className={clsx(
          'bg-surface-secondary aspect-square w-full overflow-clip',
          {
            'rounded-full': style === 'rounded',
            'rounded-xl': style === 'square',
          }
        )}
      >
        {imageToPreview && (
          <Image
            src={imageToPreview}
            width={100}
            height={100}
            alt="Preview"
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="flex-center mt-4 space-x-2 text-center">
        {canDelete && (
          <Button
            onClick={() => deleteImage()}
            size="xsmall"
            className="border-border border"
          >
            Delete
          </Button>
        )}
        {canReset && (
          <Button
            onClick={() => resetImage()}
            size="xsmall"
            className="border-border border"
          >
            Reset
          </Button>
        )}

        <SelectFileButton
          type="image"
          label={selectButtonLabel}
          onChange={setImage}
        />
      </div>
      <ErrorMessage className="mt-2 text-sm" message={error} />
    </>
  );
}
