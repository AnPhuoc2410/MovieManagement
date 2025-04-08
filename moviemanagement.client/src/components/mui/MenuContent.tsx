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
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
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
import { useAuth } from "../../contexts/AuthContext";
import { TFunction } from "i18next";

type MenuItem = {
  text: any;
  translationKey: string;
  icon: JSX.Element;
  path: string;
  roles: number[];
};

export default function MenuContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(); // Add translation hook
  const { userDetails } = useAuth();

  // Define menu items with translation keys
  const allMenuItems: MenuItem[] = [
    {
      text: t("menu.home"),
      translationKey: "menu.home",
      icon: <HomeRoundedIcon />,
      path: "/admin/thong-ke",
      roles: [2],
    },
    {
      text: t("menu.memberManagement"),
      translationKey: "menu.memberManagement",
      icon: <PeopleRoundedIcon />,
      path: "/admin/ql-thanh-vien",
      roles: [2],
    },
    {
      text: t("menu.employeeManagement"),
      translationKey: "menu.employeeManagement",
      icon: <PermIdentityRoundedIcon />,
      path: "/admin/ql-nhan-vien",
      roles: [2], // Only admin
    },
    {
      text: t("menu.ticketSales"),
      translationKey: "menu.ticketSales",
      icon: <LocalActivityRoundedIcon />,
      path: "/admin/ql-ban-ve",
      roles: [1], // Only staff
    },
    {
      text: t("menu.screeningRooms"),
      translationKey: "menu.screeningRooms",
      icon: <EventSeatRoundedIcon />,
      path: "/admin/ql-phong-chieu",
      roles: [2],
    },
    {
      text: t("menu.movieManagement"),
      translationKey: "menu.movieManagement",
      icon: <MovieCreationRoundedIcon />,
      path: "/admin/ql-phim",
      roles: [2],
    },
    {
      text: t("menu.showtimeManagement"),
      translationKey: "menu.showTimeManagement",
      icon: <LocalActivityIcon />,
      path: "/admin/ql-thoi-gian-chieu",
      roles: [2, 1],
    },
    {
      text: t("menu.promotions"),
      translationKey: "menu.promotions",
      icon: <DiscountRoundedIcon />,
      path: "/admin/khuyen-mai",
      roles: [2, 1],
    },
  ];

  // Filter menu items based on user role
  const mainListItems = allMenuItems.filter((item) => userDetails && item.roles.includes(userDetails.role));

  const secondaryListItems: MenuItem[] = [
    {
      text: t("menu.settings"),
      translationKey: "menu.settings",
      icon: <SettingsRoundedIcon />,
      path: "#",
      roles: [2, 1], // Default roles
    },
    {
      text: t("menu.feedback"),
      translationKey: "menu.feedback",
      icon: <HelpRoundedIcon />,
      path: "#",
      roles: [2, 1], // Default roles
    },
    {
      text: t("menu.aboutUs"),
      translationKey: "menu.aboutUs",
      icon: <InfoRoundedIcon />,
      path: "/about-us",
      roles: [2, 1], // Default roles
    },
  ];

  const renderList = (items: typeof mainListItems, isMain: boolean) => (
    <List dense>
      {items.map((item) => (
        <ListItem key={item.translationKey} disablePadding sx={{ display: "block" }}>
          <ListItemButton selected={location.pathname === item.path} onClick={() => navigate(item.path)} aria-label={item.text}>
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
