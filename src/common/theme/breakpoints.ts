import { createBreakpoints } from '@mui/system';

export const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
};

export const themeBreakpoints = createBreakpoints(breakpoints);
