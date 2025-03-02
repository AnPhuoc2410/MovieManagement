import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      search: "Search for a movie...",
      book_ticket: "Book Ticket",
      book_snacks: "Book Snacks",
      login: "Login",
      see_more: "See More",
      now_showing: "Now Showing",
      upcoming: "Upcoming",
      membership: "Membership",
      promotions: "Promotions",
      list_promotions: "See more Promotions",
    },
  },
  vi: {
    translation: {
      search: "Tìm kiếm phim...",
      book_ticket: "Đặt Vé",
      book_snacks: "Đặt Bắp Nước",
      login: "Đăng nhập",
      see_more: "Xem Thêm",
      now_showing: "Phim Đang Chiếu",
      upcoming: "Phim Sắp Chiếu",
      membership: "Thẻ Thành Viên",
      promotions: "Khuyến Mãi",
      list_promotions: "Xem Thêm Khuyến Mãi",
    },
  },
  jp: {
    translation: {
      search: "映画を検索する...",
      book_ticket: "チケットを予約する",
      book_snacks: "スナックを予約する",
      login: "ログイン",
      see_more: "もっと見る",
      now_showing: "上映中",
      upcoming: "近日公開",
      membership: "メンバーシップ",
      promotions: "プロモーション",
      list_promotions: "もっと見るプロモーション",
    },
  },
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: "vi",
    debug: true,
    interpolation: { escapeValue: false },
  });

export default i18n;
