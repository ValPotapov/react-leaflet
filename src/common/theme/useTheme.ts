import { useState } from "react";
import { THEME_DEFAULT, THEME_TYPE } from "./theme.variants";

export const useTheme = () => {
  const [theme, setTheme] = useState<THEME_TYPE>(THEME_DEFAULT);

  const handleTheme = (theme: THEME_TYPE) => {
    setTheme(theme);
  };

  return { theme, handleTheme };
};
