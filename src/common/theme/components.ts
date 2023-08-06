import { Components } from '@mui/material/styles';
import { Theme as SystemTheme } from '@mui/system/createTheme/createTheme';
import { Mixins } from '@mui/material/styles/createMixins';
import { Palette } from '@mui/material/styles/createPalette';
import { Shadows } from '@mui/material/styles/shadows';
import { Transitions } from '@mui/material/styles/createTransitions';
import { Typography } from '@mui/material/styles/createTypography';
import { ZIndex } from '@mui/material/styles/zIndex';

interface BaseTheme extends SystemTheme {
  mixins: Mixins;
  palette: Palette;
  shadows: Shadows;
  transitions: Transitions;
  typography: Typography;
  zIndex: ZIndex;
  unstable_strictMode?: boolean;
}

export const components: Components<BaseTheme> = {
  MuiCssBaseline: {
    styleOverrides: {
      html: {
        minHeight: '100vh',
        height: '100%',
      },
      body: {
        minHeight: '100vh',
        height: '100%',
      },
      '#root': {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      },
      img: {
        maxWidth: '100%',
      },
      a: {
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline',
        },
        '&:active': {
          color: 'inherit',
        },
      },
      input: {
        '&:-webkit-autofill': {
          backgroundColor: 'red !important',
        },
      },
      '& [role="button"]': {
        cursor: 'pointer',
      },
      '& .leaflet-div-icon': {
        border: 0,
        background: 'transparent',
      },
      '& .leaflet-routing-animate': {
        strokeDasharray: '1920',
        strokeDashoffset: '1920',
        animation: 'route 4s linear 1s forwards',
      },
      '@keyframes route': {
        "to":{
          strokeDashoffset: 0,
        }
      }
    },
  },
};
