import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import ManagementTable, {
  ColumnDef,
} from "../../../components/shared/ManagementTable";
import { QuanLyPhimColumn } from "../../../types/movie.types";
import { useNavigate } from "react-router";

const FilmTable: React.FC<{
  data: QuanLyPhimColumn[];
  onEdit?: (id: string) => void;
}> = ({ data, onEdit }) => {
  const navigate = useNavigate();

  const columns: ColumnDef<QuanLyPhimColumn>[] = [
    {
      field: "movieId",
      headerName: "Mã Phim",
    },
    {
      field: "name",
      headerName: "Tên Phim",
    },
    {
      field: "postDate",
      headerName: "Ngày khởi chiếu",
    },
    {
      field: "director",
      headerName: "Hãng phim",
    },
    {
      field: "duration",
      headerName: "Thời lượng",
    },
    {
      field: "version",
      headerName: "Phiên bản",
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
          Sửa thông tin phim
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
          Thêm phim
        </Button>
      </Box>

      <ManagementTable
        data={data}
        columns={columns}
        onEdit={onEdit}
        actionColumn={{
          align: "center",
          headerName: "Hành động",
          width: "120px",
        }}
      />
    </>
  );
};

export default FilmTable;
