import '@mui/material/styles';
import '@mui/material/Typography';
import { PaletteColor } from '@mui/material';

declare module '@mui/material//styles/createPalette' {
  interface Palette {
    light: PaletteColor;
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    light: true;
  }
}
