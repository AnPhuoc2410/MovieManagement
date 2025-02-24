import React, { useState } from "react";
import { Select, MenuItem, Box, Typography, ListItemIcon } from "@mui/material";
import { useTranslation } from "react-i18next";
import i18n from "../../constants/i18n";
import { VietnamFlag, UsaFlag, JapanFlag } from "../../data/CustomIcons";

const languages: { [key: string]: { name: string; icon: JSX.Element } } = {
    vn: { name: "Tiếng Việt", icon: <VietnamFlag /> },
    en: { name: "English", icon: <UsaFlag /> },
    jp: { name: "日本語", icon: <JapanFlag /> },
  };

const LanguageSelector = () => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState("vn");

  const handleChange = (event: any) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  return (
    <Select
      value={language}
      onChange={handleChange}
      displayEmpty
      renderValue={(selected: string) => (
        <Box display="flex" alignItems="center">
          {languages[selected]?.icon}
        </Box>
      )}
      sx={{
        backgroundColor: "transparent",
        minWidth: "50px",
        border: "none",
        boxShadow: "none", 
        "& .MuiOutlinedInput-notchedOutline": { border: "none" }, 
        "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
      }}
    >
      {Object.entries(languages).map(([code, { name, icon }]) => (
        <MenuItem key={code} value={code}>
          <ListItemIcon>{icon}</ListItemIcon>
          <Typography>{name}</Typography>
        </MenuItem>
      ))}
    </Select>
  );
};

export default LanguageSelector;
