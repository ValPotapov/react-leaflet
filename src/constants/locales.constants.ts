export const LOCALE_UZ = 'uz';
export const LOCALE_UZC = 'uzc';
export const LOCALE_RU = 'ru';
export const LOCALE_EN = 'en';

export const LOCALES_MAP = {
  //[LOCALE_UZ]: { shortName: 'O‘z', name: 'O‘zbekcha' },
  //[LOCALE_UZC]: { shortName: 'Ўз', name: 'Ўзбекча' },
  [LOCALE_RU]: { shortName: 'Ру', name: 'Русский' },
  [LOCALE_EN]: { shortName: 'En', name: 'English' },
};

export const LOCALES = Object.keys(LOCALES_MAP) as LocaleType[];

export type LocaleType = keyof typeof LOCALES_MAP;
