import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { useNavigate, useLocation } from "react-router-dom";

// Icons
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import PermIdentityRoundedIcon from "@mui/icons-material/PermIdentityRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import LocalActivityRoundedIcon from "@mui/icons-material/LocalActivityRounded";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import EventSeatRoundedIcon from "@mui/icons-material/EventSeatRounded";
import MovieCreationRoundedIcon from "@mui/icons-material/MovieCreationRounded";
import DiscountRoundedIcon from "@mui/icons-material/DiscountRounded";

const mainListItems = [
  { text: "Trang chủ", icon: <HomeRoundedIcon />, path: "/admin/thong-ke" },
  {
    text: "Quản lý Khách hàng",
    icon: <PeopleRoundedIcon />,
    path: "/admin/khach-hang",
  },
  {
    text: "Quản lý Nhân viên",
    icon: <PermIdentityRoundedIcon />,
    path: "/admin/ql-nhan-vien",
  },
  {
    text: "Quản lý Bán vé",
    icon: <LocalActivityRoundedIcon />,
    path: "/admin/ban-ve",
  },
  {
    text: "Quản lý Đặt vé",
    icon: <ConfirmationNumberRoundedIcon />,
    path: "/admin/dat-ve",
  },
  {
    text: "Quản lý Phòng chiếu",
    icon: <EventSeatRoundedIcon />,
    path: "/admin/phong-chieu",
  },
  {
    text: "Quản lý Phim",
    icon: <MovieCreationRoundedIcon />,
    path: "/admin/phim",
  },
  {
    text: "Quản lý Khuyến mãi",
    icon: <DiscountRoundedIcon />,
    path: "/admin/khuyen-mai",
  },
];

const secondaryListItems = [
  { text: "Settings", icon: <SettingsRoundedIcon />, path: "#" },
  { text: "About", icon: <InfoRoundedIcon />, path: "#" },
  { text: "Feedback", icon: <HelpRoundedIcon />, path: "#" },
];

export default function MenuContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const renderList = (items: typeof mainListItems, isMain: boolean) => (
    <List dense>
      {items.map((item) => (
        <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
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
