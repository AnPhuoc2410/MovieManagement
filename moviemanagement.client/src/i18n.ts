import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import TRANSLATION_EN from "./locales/en/translation.json";
import TRANSLATION_JP from "./locales/jp/translation.json";
import TRANSLATION_VI from "./locales/vi/translation.json";

const resources = {
  en: {
    translation: TRANSLATION_EN.translation,
  },
  vi: {
    translation: TRANSLATION_VI.translation,
  },
  jp: {
    translation: TRANSLATION_JP.translation,
  },
};

// Only initialize if not already initialized
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      lng: "vi", // default language
      ns: ["translation"],
      fallbackLng: "jp",
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
      },
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18n;
