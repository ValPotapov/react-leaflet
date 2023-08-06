import i18next from "i18next";

export const i18nPluralSuffix = (count: number = 0) => {
  return i18next.services.pluralResolver.getSuffix(i18next.language, count);
};
