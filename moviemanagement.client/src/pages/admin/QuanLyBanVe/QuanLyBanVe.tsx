import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import AdminNowShowingMovies from "../../../components/admin/AdminNowShowingMovies";
import ManagementPageLayout from "../../../layouts/ManagementLayout";

export default function QuanLyBanVe() {
  const { t } = useTranslation();
  return (
    <ManagementPageLayout>
      <Typography variant="h5" gutterBottom fontWeight="bold" align="center">
        {t("footer.movies.now_showing")}
      </Typography>
      <AdminNowShowingMovies />
    </ManagementPageLayout>
  );
}
