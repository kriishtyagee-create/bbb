import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Theme: 'dark' | 'light' | 'high-contrast'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sih_portal_theme') || 'dark';
  });

  // Font Scale: 'normal' (100%) | 'large' (115%) | 'xlarge' (130%)
  const [fontScale, setFontScale] = useState(() => {
    return localStorage.getItem('sih_portal_font_scale') || 'normal';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light', 'high-contrast');
    root.classList.add(theme);

    if (theme === 'dark' || theme === 'high-contrast') {
      root.classList.add('dark');
    }

    localStorage.setItem('sih_portal_theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('scale-normal', 'scale-large', 'scale-xlarge');
    root.classList.add(`scale-${fontScale}`);

    let scaleFactor = '1';
    if (fontScale === 'large') scaleFactor = '1.15';
    if (fontScale === 'xlarge') scaleFactor = '1.3';

    root.style.setProperty('--portal-font-scale', scaleFactor);
    localStorage.setItem('sih_portal_font_scale', fontScale);
  }, [fontScale]);

  const toggleTheme = (newTheme) => {
    if (newTheme) {
      setTheme(newTheme);
    } else {
      setTheme((prev) => (prev === 'dark' ? 'light' : prev === 'light' ? 'high-contrast' : 'dark'));
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        fontScale,
        setFontScale,
        isDark: theme === 'dark',
        isLight: theme === 'light',
        isHighContrast: theme === 'high-contrast',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
