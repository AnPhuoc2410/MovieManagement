import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ManagementTable, {
  ColumnDef,
  TableData,
} from "../../../components/shared/ManagementTable";

export interface Room extends TableData {
  roomId: string;
  name: string;
  total: number;
}

const RoomTable: React.FC<{
  rooms: Room[];
  onEdit: (id: string) => void;
}> = ({ rooms }) => {
  const navigate = useNavigate();

  const columns: ColumnDef<Room>[] = [
    {
      field: "roomId",
      headerName: "Mã phòng chiếu",
    },
    {
      field: "name",
      headerName: "Tên Phòng",
    },
    {
      field: "total",
      headerName: "Tổng số ghế",
    },
  ];

  const handleEditClick = (roomId: string) => {
    console.log("Handling click for roomId:", roomId);
    console.log("Available rooms:", rooms);
    
    if (roomId) {
      navigate(`/admin/ql-phong-chieu/${roomId}`);
    } else {
      console.error("No roomId provided");
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
        Danh sách phòng chiếu
      </Typography>

      <ManagementTable
        data={rooms}
        columns={columns}
        onEdit={handleEditClick}
        actionColumn={{
          align: "center",
          headerName: "Chi tiết ghế",
          width: "120px",
        }}
      />
    </>
  );
};

export default RoomTable;
