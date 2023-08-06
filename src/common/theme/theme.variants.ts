import { createTheme, Theme } from '@mui/material/styles';
import { components } from './components';
import { lightPalette, darkPalette } from './palettes';
import { breakpoints } from './breakpoints';
import { shadows } from './shadows';
import { shape } from './shape';
import { typography } from './typography';

export const THEME_LIGHT = createTheme({
  palette: lightPalette,
  typography,
  shape,
  shadows,
  breakpoints,
  components,
});

export const THEME_DARK = createTheme({
  palette: darkPalette,
  typography,
  shape,
  shadows,
  breakpoints,
  components,
});

export const THEME_MAP: { [key: string]: Theme } = {
  light: THEME_LIGHT,
  dark: THEME_DARK,
};

export type THEME_TYPE = typeof THEME_LIGHT | typeof THEME_DARK;

export const THEME_DEFAULT = THEME_LIGHT;
