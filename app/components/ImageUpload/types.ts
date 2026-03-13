export type ImageUploadStyle = 'rounded' | 'square';

export interface ImageUploadContextValue {
  imageToPreview?: string;
  isDelete: boolean;
  canReset: boolean;
  error: string | null;
  canDelete: boolean;
  deleteImage: () => void;
  setImage: (image: File) => void;
  resetImage: () => void;
}
