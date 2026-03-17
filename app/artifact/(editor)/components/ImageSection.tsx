import { useState } from 'react';
import { IconWrapper, InputLabel } from '@hanlogy/react-web-ui';
import { ImageUpload } from '@/components/ImageUpload/ImageUpload';
import { useImageUploadContext } from '@/components/ImageUpload/hooks';
import { AddSvg } from '@/components/svgs';

export function ImageSection() {
  const { imageToPreview } = useImageUploadContext();
  const [isExpanded, setIsExpanded] = useState<boolean>(!!imageToPreview);

  return (
    <>
      {isExpanded && (
        <div className="mt-6">
          <InputLabel className="mb-2">Image</InputLabel>
          <div className="w-45">
            <ImageUpload style="square" />
          </div>
        </div>
      )}

      {isExpanded || (
        <button
          onClick={() => setIsExpanded(true)}
          type="button"
          className="flex-center text-accent cursor-pointer"
        >
          <IconWrapper size="small">
            <AddSvg />
          </IconWrapper>
          <div className="text-sm font-semibold">Add image</div>
        </button>
      )}
    </>
  );
}
