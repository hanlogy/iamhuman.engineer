import { createContext } from 'react';
import { type ImageUploadContextValue } from './types';

export const ImageUploadContext = createContext<ImageUploadContextValue | null>(
  null
);
