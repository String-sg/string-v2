import { useState, useEffect } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem('string-theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem('string-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = () => setIsDark((d) => !d);
  const t = (light: string, dark: string) => (isDark ? dark : light);

  return { isDark, toggle, t };
}
