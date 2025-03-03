import { Box, Button, TextField, Typography } from "@mui/material";

import { useState } from "react";
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
}> = ({ rooms, onEdit }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  return (
    <>
      <Typography
        variant="h5"
        sx={{
          textAlign: "left",
          flexGrow: 1, // Allow this to take extra space if needed
        }}
      >
        Danh sách phòng chiếu
      </Typography>

      <ManagementTable
        data={rooms}
        columns={columns}
        onEdit={(id) => {
          console.log("Editing:", id);
          onEdit(id);
        }}
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
