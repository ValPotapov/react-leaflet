import { Palette } from '@mui/material/styles/createPalette';
import { lighten } from '@mui/system';

export const darkPalette: Partial<Palette> = {
  mode: 'dark',
  common: {
    white: '#fff',
    black: '#000',
  },
  primary: {
    light: '#2C87A4',
    main: '#207D69',
    dark: '#0E3C47',
    contrastText: '#FFFFFF',
  },
  secondary: {
    light: '#2C87A4',
    main: '#207D69',
    dark: '#0E3C47',
    contrastText: '#FFFFFF',
  },
  info: {
    light: '#4024A2',
    main: '#5275D0',
    dark: '#7591D9',
    contrastText: '#FFFFFF',
  },
  success: {
    light: '#65CD88',
    main: '#3EC06A',
    dark: '#38A05C',
    contrastText: '#FFFFFF',
  },
  error: {
    light: '#EF7979',
    main: '#EF7979',
    dark: '#EF7979',
    contrastText: '#FFFFFF',
  },
  warning: {
    light: '#FCCC52',
    main: '#FBBF27',
    dark: '#D0A026',
    contrastText: '#FFFFFF',
  },
  text: {
    primary: '#222222',
    secondary: lighten('#222222', 0.5),
    disabled: '#C0C0C0',
  },
  background: {
    paper: '#FFFFFF',
    default: '#FAFAFA',
  },
  grey: {
    50: '#FAFAFA',
    100: '#E5E9F0',
    200: '#D0D4E0',
    300: '#B9C0D1',
    400: '#A7A9B9',
    500: '#8E8E93',
    600: '#7D7D7D',
    700: '#636363',
    800: '#4D4D4D',
    900: '#363636',
    A100: '#F2F6FE',
    A200: '#D0D4E0',
    A400: '#A7A9B9',
    A700: '#636363',
  },
};
