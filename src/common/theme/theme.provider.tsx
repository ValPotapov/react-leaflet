import { ComponentType, PropsWithChildren } from 'react';
import { CssBaseline } from '@mui/material';
import { StyledEngineProvider, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ThemeContext } from './theme.context';
import { useTheme } from './useTheme';
import './fonts';

export const ThemeProvider: ComponentType<PropsWithChildren<unknown>> = ({ children }) => {
  const { theme, handleTheme } = useTheme();

  return (
    <ThemeContext.Provider
      value={{
        theme,
        handleTheme,
      }}
    >
      <StyledEngineProvider injectFirst>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </MuiThemeProvider>
      </StyledEngineProvider>
    </ThemeContext.Provider>
  );
};
