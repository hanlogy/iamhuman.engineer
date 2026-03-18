import { useRef, type ChangeEvent } from 'react';

export function SelectFileButton({
  type,
  label,
  onChange,
}: {
  type: 'image';
  label: string;
  onChange: (file: File) => void;
}) {
  const accept = {
    image: 'image/png,image/jpeg,image/webp',
  }[type];

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <label className="border-border inline-flex-center h-8 cursor-pointer rounded-full border px-3 text-sm font-medium">
        <input
          ref={fileInputRef}
          onChange={handleChange}
          type="file"
          accept={accept}
          className="sr-only"
        />
        {label}
      </label>
    </>
  );
}
