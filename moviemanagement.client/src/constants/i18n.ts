import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      welcome: "Welcome to Movie Management!",
      book_ticket: "Book Ticket",
      book_snacks: "Book Snacks",
      login: "Login",
    },
  },
  vn: {
    translation: {
      welcome: "Chào mừng đến với Movie Management!",
      book_ticket: "Đặt Vé",
      book_snacks: "Đặt Bắp Nước",
      login: "Đăng nhập",
    },
  },
  jp: {
    translation: {
      welcome: "ムービーマネジメントへようこそ！",
      book_ticket: "チケットを予約する",
      book_snacks: "スナックを予約する",
      login: "ログイン",
    },
  },
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: "en",
    debug: true,
    interpolation: { escapeValue: false },
  });

export default i18n;
