import { createContext } from "react";
import { THEME_TYPE, THEME_DEFAULT } from "./theme.variants";

export interface ThemeContextProps {
  theme: THEME_TYPE;
  handleTheme: (theme: THEME_TYPE) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: THEME_DEFAULT,
  handleTheme: () => {},
});
