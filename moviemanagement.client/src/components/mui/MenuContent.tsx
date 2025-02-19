import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
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
  { text: 'Trang chính', icon: <HomeRoundedIcon /> },
  { text: 'Quản lý khách Hàng', icon: <PeopleRoundedIcon /> },
  { text: 'Quản lý nhân Viên', icon: <PermIdentityRoundedIcon /> },
  { text: 'Quản lý bán vé', icon: <LocalActivityRoundedIcon /> },
  { text: 'Quản lý đặt vé', icon: <ConfirmationNumberRoundedIcon /> },
  { text: 'Quản lý phòng chiếu', icon: <EventSeatRoundedIcon /> },
  { text: 'Quản lý phim', icon: <MovieCreationRoundedIcon /> },
  { text: 'Quản lý khuyến mãi', icon: <DiscountRoundedIcon /> },
  { text: 'Thống kê', icon: <AnalyticsRoundedIcon /> },

];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon /> },
  { text: 'About', icon: <InfoRoundedIcon /> },
  { text: 'Feedback', icon: <HelpRoundedIcon /> },
];

export default function MenuContent() {
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton selected={index === 0}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
