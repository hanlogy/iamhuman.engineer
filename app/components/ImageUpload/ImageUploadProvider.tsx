'use client';

import { useCallback, useMemo, useState, type PropsWithChildren } from 'react';
import { ImageUploadContext } from './context';
import type { ImageUploadContextValue } from './types';

export function ImageUploadProvider({
  children,
  style,
  defaultImage,
}: PropsWithChildren<
  Pick<ImageUploadContextValue, 'style'> & {
    defaultImage?: string;
  }
>) {
  const [newImage, setNewImage] = useState<File | undefined>(undefined);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [error, setError] = useState('');
  const [imageToPreview, setImageToPreview] = useState<string | undefined>(
    defaultImage
  );

  const setImage = useCallback((image: File) => {
    if (image.size > 1048576) {
      setError('File size must not exceed 1MB.');
      return;
    }
    setError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setNewImage(image);
        setImageToPreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(image);
  }, []);

  const deleteImage = useCallback(() => {
    setIsDelete(true);
    setNewImage(undefined);
    setImageToPreview(undefined);
  }, []);

  const resetImage = useCallback(() => {
    setImageToPreview(defaultImage);
    setIsDelete(false);
  }, [defaultImage]);

  const canReset = useMemo(() => {
    return imageToPreview !== defaultImage;
  }, [imageToPreview, defaultImage]);

  const canDelete = useMemo(() => {
    return !!defaultImage && !isDelete;
  }, [defaultImage, isDelete]);

  const value = {
    canReset,
    canDelete,
    imageToPreview,
    style,
    isDelete,
    newImage,
    deleteImage,
    setImage,
    resetImage,
    error,
  };

  return <ImageUploadContext value={value}>{children}</ImageUploadContext>;
}
