import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ManagementTable, {
  ColumnDef,
  TableData,
} from "../../../components/shared/ManagementTable";

export interface ShowTime extends TableData {
  showTimeId: string;
  movieId: string;
  roomId: string;
  startTime: string;
  endTime: string;
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
      field: "movieId",
      headerName: "Mã phim",
    },
    {
      field: "roomId",
      headerName: "Mã phòng chiếu",
    },
    {
      field: "startTime",
      headerName: "Thời gian chiếu",
    },
    {
      field: "endTime",
      headerName: "Thời gian kết thúc",
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
      <Typography
        variant="h5"
        sx={{
          textAlign: "left",
          flexGrow: 1,
        }}
      >
        Danh sách thời gian chiếu
      </Typography>

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
