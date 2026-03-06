import { useEffect, useState } from 'react';
import { FormErrorListener } from '@hanlogy/react-web-ui';
import { ErrorMessage } from '@/components/ErrorMessage';

export const FormErrorMessage = ({
  setListener,
  className,
}: {
  setListener: (listener: FormErrorListener) => void;
  className?: string;
}) => {
  const [error, setError] = useState<string | undefined>(undefined);
  useEffect(() => {
    setListener(setError);
  }, [setListener]);

  return <ErrorMessage className={className} message={error} />;
};
