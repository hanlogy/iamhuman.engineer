import { useContext } from 'react';
import { AppContext } from './context';

export function useSettingsContext() {
  const value = useContext(AppContext);

  if (!value) {
    throw new Error('SettingsContext is not provided');
  }

  return value;
}
