import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid-pro/themeAugmentation";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import { useQuery } from "react-query";
import { fetchRoom } from "../../../apis/mock.apis";
import ManagementPageLayout from "../../../layouts/ManagementLayout";
import { Room } from "../../../types/room.types";
import RoomTable from "./BangRoom";
import Loader from "../../../components/shared/Loading/LoadingScreen";

const QuanLyPhongChieu: React.FC = () => {
  const {
    data: danhSachPhongChieu = [],
    isLoading,
    error,
  } = useQuery<Room[]>("PhongChieuData", fetchRoom);

  if (isLoading) return <Loader />;
  if (error) return <div>Failed to fetch data</div>;

  return (
    <ManagementPageLayout>
      <RoomTable
        rooms={danhSachPhongChieu}
        onEdit={(id: string) => {
          const room = danhSachPhongChieu.find((r) => r.roomId === id);
          console.log("Found room:", room);
        }}
      />
    </ManagementPageLayout>
  );
};

export default QuanLyPhongChieu;
