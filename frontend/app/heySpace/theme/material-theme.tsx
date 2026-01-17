/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { FC, useEffect } from 'react';

import { createTheme, ThemeProvider } from '@mui/material';
import { StyledEngineProvider } from '@mui/material/styles';

import { theme } from './app-theme';
import { mapObjectToCssVars } from './helpers';
import { muiComponentsStyles } from './mui-components-styles';

const materialTheme = createTheme({
  ...theme,
  typography: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: Number(theme.fontSize.sm.replace('px', '')),
    fontWeightRegular: theme.fontWeight.regular,
    fontWeightMedium: theme.fontWeight.medium,
    fontWeightBold: theme.fontWeight.semibold,
  },
  palette: {
    primary: {
      main: theme.color.primary[500],
    },
  },
  components: muiComponentsStyles,
});

export const MaterialThemeProvider: ReactFCWithChildren<{}> = ({ children }) => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={materialTheme}>{children}</ThemeProvider>
  </StyledEngineProvider>
);

export const CssVarsTheme: ReactFCWithChildren<{}> = ({ children }) => {
  useEffect(() => {
    const styles = document.createElement('style');
    styles.innerHTML = `:root{${mapObjectToCssVars(theme)}}`;
    document.head.appendChild(styles);
  }, []);

  return <>{children}</>;
};
