import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.json';
import vi from './vi.json';

i18n
  .use(LanguageDetector) // Detect browser language
  .use(initReactI18next) // Connect with React
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi }
    },
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false // React already protects from XSS
    }
  });

export default i18n;