import { createContext } from 'react';
import { type AppContextValue } from './type';

export const AppContext = createContext<AppContextValue | null>(null);
