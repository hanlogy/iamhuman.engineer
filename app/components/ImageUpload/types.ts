export type ImageUploadStyle = 'rounded' | 'square';

/**
 * Update or Delete
 */
export interface UODImage {
  readonly isDelete: boolean;
  readonly newKey?: string;
}

export interface ImageUploadContextValue {
  imageToPreview?: string;
  canReset: boolean;
  error: string | null;
  canDelete: boolean;
  deleteImage: () => void;
  setImage: (image: File) => void;
  resetImage: () => void;
  resolveImage: () => Promise<UODImage | undefined | void>;
}
