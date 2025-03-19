import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import the translation hook

// Icons
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import DiscountRoundedIcon from "@mui/icons-material/DiscountRounded";
import EventSeatRoundedIcon from "@mui/icons-material/EventSeatRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import LocalActivityRoundedIcon from "@mui/icons-material/LocalActivityRounded";
import MovieCreationRoundedIcon from "@mui/icons-material/MovieCreationRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import PermIdentityRoundedIcon from "@mui/icons-material/PermIdentityRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

export default function MenuContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(); // Add translation hook

  // Define menu items with translation keys
  const mainListItems = [
    {
      text: t("menu.home"),
      translationKey: "menu.home",
      icon: <HomeRoundedIcon />,
      path: "/admin/thong-ke",
    },
    {
      text: t("menu.memberManagement"),
      translationKey: "menu.memberManagement",
      icon: <PeopleRoundedIcon />,
      path: "/admin/ql-thanh-vien",
    },
    {
      text: t("menu.employeeManagement"),
      translationKey: "menu.employeeManagement",
      icon: <PermIdentityRoundedIcon />,
      path: "/admin/ql-nhan-vien",
    },
    {
      text: t("menu.ticketSales"),
      translationKey: "menu.ticketSales",
      icon: <LocalActivityRoundedIcon />,
      path: "/admin/ban-ve",
    },
    {
      text: t("menu.ticketBooking"),
      translationKey: "menu.ticketBooking",
      icon: <ConfirmationNumberRoundedIcon />,
      path: "/admin/ql-dat-ve",
    },
    {
      text: t("menu.screeningRooms"),
      translationKey: "menu.screeningRooms",
      icon: <EventSeatRoundedIcon />,
      path: "/admin/ql-phong-chieu",
    },
    {
      text: t("menu.movieManagement"),
      translationKey: "menu.movieManagement",
      icon: <MovieCreationRoundedIcon />,
      path: "/admin/ql-phim",
    },
    {
      text: "Quản lí thời gian chiếu",
      translationKey: "menu.showTimeManagement",
      icon: <LocalActivityIcon />,
      path: "/admin/ql-thoi-gian-chieu",
    },
    {
      text: t("menu.promotions"),
      translationKey: "menu.promotions",
      icon: <DiscountRoundedIcon />,
      path: "/admin/khuyen-mai",
    },
  ];

  const secondaryListItems = [
    {
      text: t("menu.settings"),
      translationKey: "menu.settings",
      icon: <SettingsRoundedIcon />,
      path: "#",
    },
    {
      text: t("menu.feedback"),
      translationKey: "menu.feedback",
      icon: <HelpRoundedIcon />,
      path: "#",
    },
    {
      text: t("menu.aboutUs"),
      translationKey: "menu.aboutUs",
      icon: <InfoRoundedIcon />,
      path: "#",
    },
  ];

  const renderList = (items: typeof mainListItems, isMain: boolean) => (
    <List dense>
      {items.map((item) => (
        <ListItem
          key={item.translationKey}
          disablePadding
          sx={{ display: "block" }}
        >
          <ListItemButton
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            aria-label={item.text}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      {renderList(mainListItems, true)}
      {renderList(secondaryListItems, false)}
    </Stack>
  );
}
