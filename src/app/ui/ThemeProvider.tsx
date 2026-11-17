'use client';

import * as React from 'react';

export interface UseThemeProps {
  theme?: string;
  setTheme: (theme: string) => void;
  themes: string[];
  systemTheme?: 'dark' | 'light';
  resolvedTheme?: string;
  forcedTheme?: string;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  forcedTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  storageKey?: string;
  themes?: string[];
  value?: Record<string, string>;
  nonce?: string;
}

const ThemeContext = React.createContext<UseThemeProps>({
  theme: 'dark',
  setTheme: () => {},
  themes: ['dark', 'corporate'],
  resolvedTheme: 'dark',
  forcedTheme: 'dark',
});

export const useTheme = () => React.useContext(ThemeContext);

export function ThemeProvider({
  children,
  attribute = 'data-theme',
  defaultTheme = 'dark',
  forcedTheme,
  storageKey = 'theme',
  themes = ['dark', 'corporate'],
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<string>(forcedTheme || defaultTheme || 'dark');

  // Load from localStorage on mount (client-only)
  React.useEffect(() => {
    if (forcedTheme) {
      document.documentElement.setAttribute(attribute, forcedTheme);
      return;
    }

    try {
      const saved = localStorage.getItem(storageKey);
      const active = saved || defaultTheme || 'dark';
      setThemeState(active);
      document.documentElement.setAttribute(attribute, active);
    } catch {
      // Fallback
      document.documentElement.setAttribute(attribute, 'dark');
    }
  }, [forcedTheme, defaultTheme, attribute, storageKey]);

  const setTheme = React.useCallback(
    (newTheme: string) => {
      if (forcedTheme) return;
      setThemeState(newTheme);
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch {
        // ignore
      }
      document.documentElement.setAttribute(attribute, newTheme);
    },
    [forcedTheme, attribute, storageKey]
  );

  const value = React.useMemo<UseThemeProps>(
    () => ({
      theme: forcedTheme || theme,
      setTheme,
      themes,
      resolvedTheme: forcedTheme || theme,
      forcedTheme,
    }),
    [forcedTheme, theme, setTheme, themes]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
