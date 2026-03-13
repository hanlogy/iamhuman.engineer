import { useContext } from 'react';
import { AppContext } from './context';

export function useAppContext() {
  const value = useContext(AppContext);

  if (!value) {
    throw new Error('AppContext is not provided');
  }

  return value;
}
