import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid-pro/themeAugmentation";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import { useState } from "react";
import { useQuery } from "react-query";
import { fetchRoom } from "../../../apis/mock.apis";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ManagementPageLayout from "../../../layouts/ManagementPageLayout";
import { Room } from "../../../types/room.types";
import RoomTable from "./BangRoom";
import ChinhSuaPhongChieu from "./ChinhSuaPhongChieu";

const QuanLyPhongChieu: React.FC = () => {
  const {
    data: danhSachPhongChieu = [],
    isLoading,
    error,
  } = useQuery<Room[]>("PhongChieuData", fetchRoom);

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = (id: string) => {
    console.log("Handling edit for ID:", id);
    const Room = danhSachPhongChieu.find((emp) => emp.roomId === id);
    if (Room) {
      setSelectedRoom(Room);
      setIsEditDialogOpen(true);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Failed to fetch data</div>;

  return (
    <ManagementPageLayout>
      <RoomTable rooms={danhSachPhongChieu} onEdit={handleEdit} />

      <ChinhSuaPhongChieu
        isDialogOpen={isEditDialogOpen}
        handleCloseDialog={() => {
          setIsEditDialogOpen(false);
          setSelectedRoom(null);
        }}
        roomData={selectedRoom}
      />
    </ManagementPageLayout>
  );
};

export default QuanLyPhongChieu;
