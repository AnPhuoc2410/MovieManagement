import React, { useEffect, useState } from "react";
import i18n from "../i18n";
import { LanguageContext } from "../contexts/LanguageContext";

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem("language") || "vi";
  });

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
      setCurrentLanguage(storedLanguage);
    } else {
      localStorage.setItem("language", "vi");
      i18n.changeLanguage("vi");
      setCurrentLanguage("vi");
    }
  }, []);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
