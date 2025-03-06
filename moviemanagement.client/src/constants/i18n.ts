import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import TRANSLATION_EN from "../locales/en/translation.json";
import TRANSLATION_VI from "../locales/vi/translation.json";
import TRANSLATION_JP from "../locales/jp/translation.json";

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

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    lng: "vi",
    ns: ["translation"],
    fallbackLng: "en",
    debug: true,
    interpolation: { escapeValue: false },
  });

export default i18n;
