import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        nowShowing: "Now Showing",
        upcomingMovies: "Upcoming Movies",
        bookTicket: "Book Ticket",
        viewMore: "View More",
        movies: {
          "Kimi wo Aishita Hitori no Boku e (T16)": "To the Only Me Who Loved You",
          "Boku ga Aishita Subete no Kimi e (T16)": "To Every You I've Loved Before",
          "Tenki No Ko (T16)": "Weathering With You",
          "Kimi no Na wa (T16)": "Your Name",
          "Suzume no Tojimari (T16)": "Suzume",
          "Spirited Away (T16)": "Spirited Away",
          "Pokemon Collection 22 (T16)": "Pokemon Collection 22",
          "Captain America: Brave New World (T18)": "Captain America: Brave New World",
          "Minecraft: The Movie (T16)": "Minecraft: The Movie",
          "Pokemon Heros The Movie (T16)": "Pokemon Heroes: The Movie",
        },
      },
    },
    jp: {
      translation: {
        nowShowing: "現在上映中",
        upcomingMovies: "近日公開",
        bookTicket: "チケットを予約する",
        viewMore: "もっと見る",
        movies: {
          "Kimi wo Aishita Hitori no Boku e (T16)": "君を愛したひとりの僕へ",
          "Boku ga Aishita Subete no Kimi e (T16)": "僕が愛したすべての君へ",
          "Tenki No Ko (T16)": "天気の子",
          "Kimi no Na wa (T16)": "君の名は。",
          "Suzume no Tojimari (T16)": "すずめの戸締まり",
          "Spirited Away (T16)": "千と千尋の神隠し",
          "Pokemon Collection 22 (T16)": "ポケモン コレクション22",
          "Captain America: Brave New World (T18)": "キャプテン・アメリカ: ブレイブ・ニュー・ワールド",
          "Minecraft: The Movie (T16)": "マインクラフト: ザ・ムービー",
          "Pokemon Heros The Movie (T16)": "ポケモン ヒーローズ: ザ・ムービー",
        },
      },
    },
  },
  lng: "en", // Default language
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
