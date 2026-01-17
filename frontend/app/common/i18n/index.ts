import i18next from 'i18next';
import {
  I18nextProvider,
  Trans as TransWrapper,
  initReactI18next,
  useTranslation as translationHook,
} from 'react-i18next';
import en from './resources/en/resource.json';
import fr from './resources/fr/resource.json';
import hu from './resources/hu/resource.json';
import pl from './resources/pl/resource.json';
import { TranslateFunction } from './types';

export const TranslationProvider = I18nextProvider;

export const availableResources = {
  en: { translations: en },
  pl: { translations: pl },
  hu: { translations: hu },
  fr: { translations: fr },
};

i18next.use(initReactI18next).init({
  fallbackLng: 'en',
  debug: false,
  resources: availableResources,

  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations',

  keySeparator: '|', // we use content as keys
  nsSeparator: false,
  returnEmptyString: false,

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ',',
  },

  react: {
    bindI18nStore: false,
    bindI18n: 'languageChanged',
  },
});

export const i18n = i18next;

// IT's only for marking consts to be discovered by scanner
export const i18mark: TranslateFunction = (text: string): string => text;

export const Trans = TransWrapper;
export const useTranslation = translationHook;
