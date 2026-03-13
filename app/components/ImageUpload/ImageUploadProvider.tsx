'use client';

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { uploadImage } from '@/actions/uploadImage';
import type { S3Folder } from '@/definitions/types';
import { ImageUploadContext } from './context';

export function ImageUploadProvider({
  children,
  defaultImage,
  folder,
}: PropsWithChildren<{
  defaultImage?: string;
  folder: S3Folder;
}>) {
  const selectedFileRef = useRef<File | undefined>(undefined);
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
        selectedFileRef.current = image;
        setImageToPreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(image);
  }, []);

  const deleteImage = useCallback(() => {
    setIsDelete(true);
    selectedFileRef.current = undefined;
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

  const resolveImage = useCallback(async () => {
    setError('');
    if (isDelete) {
      return {
        isDelete: true,
        newKey: undefined,
      };
    }

    const fileToUpload = selectedFileRef.current;
    if (!fileToUpload) {
      return {
        isDelete: false,
        newKey: undefined,
      };
    }

    const { error, data } = await uploadImage({
      folder,
      image: fileToUpload,
    });

    if (error) {
      // TODO: Improve error handling
      setError(error.message ?? 'Failed to upload, because of unknown reason');
      return;
    }

    return {
      isDelete: false,
      newKey: data,
    };
  }, [isDelete, folder]);

  const value = {
    error,
    canReset,
    canDelete,
    imageToPreview,
    deleteImage,
    setImage,
    resetImage,
    resolveImage,
  };

  return <ImageUploadContext value={value}>{children}</ImageUploadContext>;
}
