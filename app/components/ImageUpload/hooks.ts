import { useContext } from 'react';
import { ImageUploadContext } from './context';

export function useImageUploadContext() {
  const value = useContext(ImageUploadContext);

  if (!value) {
    throw new Error('ImageUploadContext is not provided');
  }

  return value;
}
