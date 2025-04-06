import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import ManagementTable, {
  ColumnDef,
} from "../../../components/shared/ManagementTable";
import { QuanLyPhimColumn } from "../../../types/movie.types";
import { useNavigate } from "react-router";
import { t } from "i18next";

const FilmTable: React.FC<{
  data: QuanLyPhimColumn[];
  onEdit?: (id: string) => void;
}> = ({ data, onEdit }) => {
  const navigate = useNavigate();

  const columns: ColumnDef<QuanLyPhimColumn>[] = [
    {
      field: "movieId",
      headerName: t("admin.movie_management.column.movie_id"),
    },
    {
      field: "name",
      headerName: t("admin.movie_management.column.movie_name"),
    },
    {
      field: "postDate",
      headerName: t("admin.movie_management.column.showtime"),
    },
    {
      field: "director",
      headerName: t("admin.movie_management.column.director"),
    },
    {
      field: "duration",
      headerName: t("admin.movie_management.column.duration"),
    },
    {
      field: "version",
      headerName: t("admin.movie_management.column.version"),
    },
  ];

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "1rem",
          flexWrap: "wrap",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            textAlign: "left",
          }}
        >
          {t("admin.movie_management.update")}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{
            flexShrink: 0, // Prevent button from shrinking
          }}
          onClick={() => {
            navigate("/admin/ql-phim/them-phim");
          }}
        >
          {t("admin.movie_management.add")}
        </Button>
      </Box>

      <ManagementTable
        data={data}
        columns={columns}
        onEdit={onEdit}
        actionColumn={{
          align: "center",
          headerName: t("admin.movie_management.column.action"),
          width: "120px",
        }}
      />
    </>
  );
};

export default FilmTable;
