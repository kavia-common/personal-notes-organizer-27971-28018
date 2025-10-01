import React, { createContext, useContext, useMemo, PropsWithChildren } from 'react';
import { OceanTheme, ThemeType } from './theme';

const ThemeContext = createContext<ThemeType>(OceanTheme);

export function ThemeProvider({ children }: PropsWithChildren<object>) {
  // In future theme switching could go here.
  const value = useMemo(() => OceanTheme, []);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// PUBLIC_INTERFACE
export function useTheme(): ThemeType {
  /** Get the current UI theme object */
  return useContext(ThemeContext);
}
