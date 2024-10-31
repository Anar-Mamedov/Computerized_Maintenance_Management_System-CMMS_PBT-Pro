import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next"; // Doğru import

import translationEN from "../locales/en/translation.json";
import translationTR from "../locales/tr/translation.json";
import translationRU from "../locales/ru/translation.json";
import translationAZ from "../locales/az/translation.json";

// the translations
const resources = {
  en: {
    translation: translationEN,
  },
  tr: {
    translation: translationTR,
  },
  ru: {
    translation: translationRU,
  },
  az: {
    translation: translationAZ,
  },
};

i18n
  .use(detector)
  .use(initReactI18next) // Doğru kullanım
  .init({
    resources,
    fallbackLng: "tr", // use en if detected lng is not available
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
