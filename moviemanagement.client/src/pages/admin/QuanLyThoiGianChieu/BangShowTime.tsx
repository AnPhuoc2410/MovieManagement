import { Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ManagementTable, {
  ColumnDef,
  TableData,
} from "../../../components/shared/ManagementTable";

export interface ShowTime extends TableData {
  showTimeId: string;
  roomId: string;
  startTime: string;
  endTime: string;
  movie: {
    movieName: string;
  };
  room: {
    roomName: string;
  };
}

const ShowTimeTable: React.FC<{
  showTimes: ShowTime[];
  onEdit: (id: string) => void;
}> = ({ showTimes }) => {
  const navigate = useNavigate();

  const columns: ColumnDef<ShowTime>[] = [
    {
      field: "showTimeId",
      headerName: "Mã thời gian chiếu",
    },
    {
      field: "movie",
      headerName: "Tên phim",
      renderCell: (item: ShowTime) => item.movie?.movieName || "N/A"
    },
    {
      field: "room",
      headerName: "Tên phòng chiếu",
      renderCell: (item: ShowTime) => item.room?.roomName || "N/A"
    },
    {
      field: "startTime",
      headerName: "Thời gian chiếu",
      renderCell: (item: ShowTime) => {
        if (!item.startTime) return "N/A";
        const date = new Date(item.startTime);
        return date.toLocaleString('vi-VN');
      }
    },
    {
      field: "endTime",
      headerName: "Thời gian kết thúc",
      renderCell: (item: ShowTime) => {
        if (!item.endTime) return "N/A";
        const date = new Date(item.endTime);
        return date.toLocaleString('vi-VN');
      }
    },
  ];

  const handleEditClick = (showTimeId: string) => {
    console.log("Handling click for showTimeId:", showTimeId);
    console.log("Available showTimes:", showTimes);

    if (showTimeId) {
      navigate(`/admin/ql-thoi-gian-chieu/${showTimeId}`);
    } else {
      console.error("No showTimeId provided");
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "1rem",  
        }}
      >
        <Typography
          variant="h5"
        sx={{
          textAlign: "left",
          flexGrow: 1,
        }}
      >
        Danh sách thời gian chiếu
      </Typography>
      <Button
          variant="contained"
          color="primary"
          sx={{
            flexShrink: 0, // Prevent button from shrinking
          }}
          onClick={() => {
            navigate("/admin/ql-thoi-gian-chieu/them-thoi-gian-chieu");
          }}
        >
          Thêm thời gian chiếu
        </Button>
      </Box>
      <ManagementTable
        data={showTimes}
        columns={columns}
        onEdit={handleEditClick}
        actionColumn={{
          align: "center",
          headerName: "Chi tiết thời gian chiếu",
          width: "120px",
        }}
      />
    </>
  );
};

export default ShowTimeTable;
