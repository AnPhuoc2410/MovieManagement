import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid-pro/themeAugmentation";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import { useQuery, useQueryClient } from "react-query";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import ManagementPageLayout from "../../../layouts/ManagementLayout";
import RoomTable, { Room } from "./BangRoom";
import Loader from "../../../components/shared/Loading/LoadingScreen";
import ChiTietPhongChieu from "./ChiTietPhongChieu";
import CreateRoom from "./CreateRoom";
import api from "../../../apis/axios.config";
import { useEffect } from "react";

const QuanLyPhongChieu: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isDetailPage = location.pathname.split('/').length > 3;
  
  // Only fetch data on the main page, not on detail pages
  const shouldFetchData = !isDetailPage;
  
  // Use the new API endpoint instead of the mock API
  const fetchRooms = async (): Promise<Room[]> => {
    try {
      const response = await api.get('room'); 
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
    refetch
  } = useQuery<Room[]>("PhongChieuData", fetchRooms, {
    enabled: shouldFetchData,
  });
  
  // Function to refresh the data
  const handleRefreshData = () => {
    if (shouldFetchData) {
      // Invalidate both the main data query and any room detail queries
      queryClient.invalidateQueries('PhongChieuData');
      queryClient.invalidateQueries('rooms');
      refetch();
    }
  };

  // Monitor location state for refresh signals
  useEffect(() => {
    // If returning to the main page from a detail page or if location state has refresh=true
    const shouldRefresh = 
      (location.state && location.state.refresh) || 
      (location.pathname.endsWith('/ql-phong-chieu') && location.key);

    if (shouldRefresh && shouldFetchData) {
      console.log("Auto refreshing room data...");
      handleRefreshData();
      
      // Clear the location state to prevent repeated refreshes
      if (location.state && location.state.refresh) {
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location, shouldFetchData]);

  if (isLoading && shouldFetchData) return <Loader />;

  if (error) {
    return (
      <ManagementPageLayout>
        <div>Error: {(error as Error).message}</div>
      </ManagementPageLayout>
    );
  }

  return (
    <>
      {!isDetailPage ? (
        <ManagementPageLayout>
          <RoomTable 
            rooms={danhSachPhongChieu} 
            onEdit={(id: string) => console.log("Edit room:", id)} 
            onRefreshData={handleRefreshData}
          />
        </ManagementPageLayout>
      ) : (
        <Routes>
          <Route path="/:id" element={<ChiTietPhongChieu />} />
          <Route path="/them-phong-chieu" element={<CreateRoom />} />
        </Routes>
      )}
    </>
  );
};

export default QuanLyPhongChieu;
