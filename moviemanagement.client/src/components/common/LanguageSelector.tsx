import { Box, ListItemIcon, MenuItem, Select, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { JapanFlag, UsaFlag, VietnamFlag } from "../../data/CustomIcons";

const languages: { [key: string]: { name: string; icon: JSX.Element } } = {
  vi: { name: "VN", icon: <VietnamFlag /> },
  en: { name: "ENG", icon: <UsaFlag /> },
  jp: { name: "JP", icon: <JapanFlag /> },
};

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const language = i18n.language;

  const handleChange = (event: any) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <Select
      value={language}
      onChange={handleChange}
      displayEmpty
      renderValue={(selected: string) => (
        <Box
          display="flex"
          alignItems="center"
          sx={{
            gap: 1,
            color: "white",
          }}
        >
          {languages[selected]?.icon} {languages[selected]?.name}
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
