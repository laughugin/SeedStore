import { createTheme, ThemeOptions } from '@mui/material/styles';

// Common theme options
const commonThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: 'var(--mui-palette-background-default)',
          color: 'var(--mui-palette-text-primary)',
          transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          borderRadius: 12,
        },
      },
    },
  },
};

// Light theme
export const lightTheme = createTheme({
  ...commonThemeOptions,
  palette: {
    mode: 'light',
    primary: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2E7D32',
      secondary: '#1B5E20',
    },
    divider: 'rgba(46, 125, 50, 0.12)',
  },
  components: {
    ...commonThemeOptions.components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#2E7D32',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          '& .MuiIconButton-root': {
            color: '#2E7D32',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(46, 125, 50, 0.2)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#2E7D32',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          color: '#2E7D32',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(46, 125, 50, 0.12)',
            '&:hover': {
              backgroundColor: 'rgba(46, 125, 50, 0.16)',
            },
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderColor: 'rgba(46, 125, 50, 0.5)',
            },
            '&:hover fieldset': {
              borderColor: '#2E7D32',
            },
          },
        },
      },
    },
  },
});

// Dark theme
export const darkTheme = createTheme({
  ...commonThemeOptions,
  palette: {
    mode: 'dark',
    primary: {
      main: '#4CAF50',
      light: '#66BB6A',
      dark: '#2E7D32',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4CAF50',
      light: '#66BB6A',
      dark: '#2E7D32',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#4CAF50',
      secondary: '#66BB6A',
    },
    divider: 'rgba(76, 175, 80, 0.12)',
  },
  components: {
    ...commonThemeOptions.components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E',
          color: '#4CAF50',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          '& .MuiIconButton-root': {
            color: '#4CAF50',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(76, 175, 80, 0.2)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E',
          color: '#4CAF50',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1E1E1E',
          color: '#4CAF50',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(76, 175, 80, 0.16)',
            '&:hover': {
              backgroundColor: 'rgba(76, 175, 80, 0.2)',
            },
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            '& fieldset': {
              borderColor: 'rgba(76, 175, 80, 0.5)',
            },
            '&:hover fieldset': {
              borderColor: '#4CAF50',
            },
          },
        },
      },
    },
  },
});