import { useContext } from 'react';
import { SettingsContext } from './context';

export function useSettingsContext() {
  const value = useContext(SettingsContext);

  if (!value) {
    throw new Error('SettingsContext is not provided');
  }

  return value;
}
