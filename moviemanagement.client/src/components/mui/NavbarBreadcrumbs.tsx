import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';

const slugMapping: { [key: string]: string } = {
  'khuyen-mai': 'Khuyến mãi',
  'thong-ke': 'Thống kê',
};

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

function getBreadcrumbs(pathname: string): string[] {

  if(pathname === '/admin/thong-ke'){
    return ['Trang chủ'];
  }

  const parts = pathname.split('/').filter(Boolean);
  const breadcrumbs = ['Trang chủ'];

  if (parts.length > 0) {
    const lastPart = parts[parts.length - 1];
    if (slugMapping[lastPart]) {
      breadcrumbs.push(slugMapping[lastPart]);
    } else {
      breadcrumbs.push(lastPart.charAt(0).toUpperCase() + lastPart.slice(1));
    }
  }

  return breadcrumbs;
}

export default function NavbarBreadcrumbs() {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      {breadcrumbs.map((label, index) => (
        <Typography
          key={index}
          variant="body1"
          sx={index === breadcrumbs.length - 1 ? { color: 'text.primary', fontWeight: 600 } : {}}
        >
          {label}
        </Typography>
      ))}
    </StyledBreadcrumbs>
  );
}
