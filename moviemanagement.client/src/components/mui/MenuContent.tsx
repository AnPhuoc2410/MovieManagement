import * as React from 'react';
import { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';

// Icons
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import PermIdentityRoundedIcon from '@mui/icons-material/PermIdentityRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import LocalActivityRoundedIcon from '@mui/icons-material/LocalActivityRounded';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import EventSeatRoundedIcon from '@mui/icons-material/EventSeatRounded';
import MovieCreationRoundedIcon from '@mui/icons-material/MovieCreationRounded';
import DiscountRoundedIcon from '@mui/icons-material/DiscountRounded';

const mainListItems = [
  { text: 'Trang chính', icon: <HomeRoundedIcon />, path: '/admin' },
  { text: 'Quản lý khách Hàng', icon: <PeopleRoundedIcon />, path: '/customers' },
  { text: 'Quản lý nhân Viên', icon: <PermIdentityRoundedIcon />, path: '/employees' },
  { text: 'Quản lý bán vé', icon: <LocalActivityRoundedIcon />, path: '/ticket-sales' },
  { text: 'Quản lý đặt vé', icon: <ConfirmationNumberRoundedIcon />, path: '/booking' },
  { text: 'Quản lý phòng chiếu', icon: <EventSeatRoundedIcon />, path: '/screen-rooms' },
  { text: 'Quản lý phim', icon: <MovieCreationRoundedIcon />, path: '/movies' },
  { text: 'Quản lý khuyến mãi', icon: <DiscountRoundedIcon />, path: '/admin/promotions' },
  { text: 'Thống kê', icon: <AnalyticsRoundedIcon />, path: '/statistics' },
];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon />, path: '/settings' },
  { text: 'About', icon: <InfoRoundedIcon />, path: '/about' },
  { text: 'Feedback', icon: <HelpRoundedIcon />, path: '/feedback' },
];

export default function MenuContent() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const handleMenuClick = (index: number, path: string) => {
    setSelectedIndex(index);
    navigate(path);
  };

  const renderList = (items: typeof mainListItems, isMain: boolean) => (
    <List dense>
      {items.map((item, index) => {
        const listIndex = isMain ? index : mainListItems.length + index;
        return (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              selected={selectedIndex === listIndex}
              onClick={() => handleMenuClick(listIndex, item.path)}
              aria-label={item.text}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      {renderList(mainListItems, true)}
      {renderList(secondaryListItems, false)}
    </Stack>
  );
}
