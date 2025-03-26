import * as React from "react";
import { useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { useTranslation } from "react-i18next"; // Import translation hook

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "center",
  },
}));

export default function NavbarBreadcrumbs() {
  const location = useLocation();
  const { t } = useTranslation(); // Add translation hook

  // Maps route slugs to translation keys
  const slugToTranslationKey: { [key: string]: string } = {
    "khuyen-mai": "breadcrumbs.promotions",
    "thong-ke": "breadcrumbs.dashboard",
    "ql-phim": "breadcrumbs.movies",
    "ql-phong-chieu": "breadcrumbs.screeningRooms",
    "ql-dat-ve": "breadcrumbs.ticketBooking",
    "ban-ve": "breadcrumbs.ticketSales",
    "ql-nhan-vien": "breadcrumbs.employees",
    "ql-thanh-vien": "breadcrumbs.members",
  };

  function getBreadcrumbs(pathname: string): [string[], string[]] {
    if (pathname === "/admin/thong-ke") {
      return [[t("breadcrumbs.home")], ["/admin/thong-ke"]];
    }

    const parts = pathname.split("/").filter(Boolean);
    console.log(parts);
    const breadcrumbs = [t("breadcrumbs.home")];
    const paths = ["/admin/thong-ke"];

    paths.push(pathname);

    if (parts.length > 0) {
      const lastPart = parts[parts.length - 1];
      if (slugToTranslationKey[lastPart]) {
        // Use translation key for known routes
        breadcrumbs.push(t(slugToTranslationKey[lastPart]));
      } else {
        // Fallback for unknown routes
        breadcrumbs.push(lastPart.charAt(0).toUpperCase() + lastPart.slice(1));
      }
    }
    console.log(breadcrumbs, paths);
    return [breadcrumbs, paths];
  }

  const [breadcrumbs, paths] = getBreadcrumbs(location.pathname);

  return (
    <StyledBreadcrumbs
      aria-label={t("common.breadcrumb")}
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      {breadcrumbs.map((label, index) => (
        <Typography
          key={index}
          variant="h5"
          sx={
            index === breadcrumbs.length - 1
              ? { color: "text.primary", fontWeight: 600 }
              : {}
          }
          component="a"
          // href={paths[index]}
        >
          {label}
        </Typography>
      ))}
    </StyledBreadcrumbs>
  );
}
