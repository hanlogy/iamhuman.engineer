import { createContext } from 'react';
import { type SettingsContextValue } from './type';

export const SettingsContext = createContext<SettingsContextValue | null>(null);
