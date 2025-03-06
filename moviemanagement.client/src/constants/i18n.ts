import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import TRANSLATION_EN from "moviemanagement.client/src/locales/en/translation.json";
import TRANSLATION_VI from "moviemanagement.client/src/locales/vi/translation.json";
import TRANSLATION_JP from "moviemanagement.client/src/locales/jp/translation.json";

const resources = {
  en: {
    translation: TRANSLATION_EN,
  },
  vi: {
    translation: TRANSLATION_VI,
  },
  jp: {
    translation: TRANSLATION_JP,
  },
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    lng: "vi",
    ns: ["translation"],
    fallbackLng: "vi",
    debug: true,
    interpolation: { escapeValue: false },
  });

export default i18n;
