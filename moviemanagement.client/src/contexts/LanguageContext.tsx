import { createContext } from "react";

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: "en",
  changeLanguage: () => {},
});
