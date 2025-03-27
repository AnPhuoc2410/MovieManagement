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

    parts.forEach((part, index) => {
      // Check if the part is a known slug
      if (slugToTranslationKey[part]) {
        breadcrumbs.push(t(slugToTranslationKey[part]));
        paths.push(`/${parts.slice(0, index + 1).join("/")}`);
      }
      // Check if the part is a dynamic ID (e.g., UUID or number)
      else if (!isNaN(Number(part)) || part.match(/^[0-9a-fA-F-]{36}$/)) {
        // Do nothing (skip adding dynamic ID to breadcrumbs)
      }
      // Fallback for unknown routes
      else {
        breadcrumbs.push(part.charAt(0).toUpperCase() + part.slice(1));
        paths.push(`/${parts.slice(0, index + 1).join("/")}`);
      }
    });
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
