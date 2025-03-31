import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid-pro/themeAugmentation";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import { useQuery } from "react-query";
import axios from "axios";
import ManagementPageLayout from "../../../layouts/ManagementLayout";
import RoomTable, { Room } from "./BangRoom";
import Loader from "../../../components/shared/Loading/LoadingScreen";

const QuanLyPhongChieu: React.FC = () => {
  // Use the new API endpoint instead of the mock API
  const fetchRooms = async (): Promise<Room[]> => {
    try {
      const response = await axios.get('https://localhost:7119/api/room/all');
      console.log("API Response:", response.data);
      
      // The API returns data in a nested 'data' property
      const rooms = response.data.data || [];
      
      // Make sure each room has the expected properties
      return rooms.map((room: any) => ({
        roomId: room.roomId,
        roomName: room.roomName,
        total: room.total,
      }));
    } catch (error) {
      console.error("Error fetching rooms:", error);
      throw error;
    }
  };

  const {
    data: danhSachPhongChieu = [],
    isLoading,
    error,
  } = useQuery<Room[]>("PhongChieuData", fetchRooms);

  if (isLoading) return <Loader />;
  if (error) return <div>Failed to fetch data</div>;

  // Log the processed data to verify
  console.log("Processed Room Data:", danhSachPhongChieu);

  return (
    <ManagementPageLayout>
      <RoomTable
        rooms={danhSachPhongChieu}
        onEdit={(id: string) => {
          const room = danhSachPhongChieu.find((r) => r.roomId === id);
          console.log("Found room:", room);
        }}
        rowHeight={70}
      />
    </ManagementPageLayout>
  );
};

export default QuanLyPhongChieu;
