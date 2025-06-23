import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from '../theme';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // Load theme from user preferences when user logs in
  useEffect(() => {
    if (user?.theme) {
      setIsDarkMode(user.theme === 'dark');
      localStorage.setItem('theme', user.theme);
    }
  }, [user]);

  const updateUserTheme = async (theme: string) => {
    try {
      const token = localStorage.getItem('token');
      if (token && user) {
        await api.put('/api/v1/users/me', {
          theme: theme
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Failed to update user theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
    updateUserTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <MuiThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}; 