import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid-pro/themeAugmentation";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import { useQuery } from "react-query";
import axios from "axios";
import { ShowTime as ShowTimeType } from "../../../types/showtime.types";
import ManagementPageLayout from "../../../layouts/ManagementLayout";
import ShowTimeTable, { ShowTime as ShowTimeDisplay } from "./BangShowTime";
import Loader from "../../../components/shared/Loading/LoadingScreen";
import api from "../../../apis/axios.config";
import { useNavigate } from "react-router-dom";
import { Button, Box, Typography } from "@mui/material";

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  isSuccess: boolean;
  data: T;
}

const fetchShowtimes = async (): Promise<ShowTimeType[]> => {
  try {
    const response = await api.get<ApiResponse<ShowTimeType[]>>("showtime");
    if (!response.data.isSuccess) {
      console.error("API returned error:", response.data.message);
      return [];
    }
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching showtimes:", error);
    return [];
  }
};

const transformShowTimeForDisplay = (showtime: ShowTimeType): ShowTimeDisplay => {
  // Convert the Date object to string for consistent handling in DataGrid
  const formattedStartTime = showtime.startTime instanceof Date ? 
    showtime.startTime.toISOString() : 
    String(showtime.startTime);
    
  return {
    id: showtime.showTimeId, // DataGrid requires a unique id field
    showTimeId: showtime.showTimeId,
    movieId: showtime.movieId,
    roomId: showtime.roomId,
    startTime: formattedStartTime,
    endTime: showtime.endTime,
    movie: {
      movieName: showtime.movie?.movieName || 'N/A'
    },
    room: {
      roomName: showtime.room?.roomName || 'N/A'
    }
  };
};

const QuanLyPhongChieu: React.FC = () => {
  const navigate = useNavigate();
  const {
    data: danhSachThoiGianChieu = [],
    isLoading,
    error,
  } = useQuery<ShowTimeType[]>("ThoiGianChieuData", fetchShowtimes, {
    onError: (error) => {
      console.error("Query error:", error);
    },
    retry: 1,
  });
  
  const handleNavigateToAddShowtime = () => {
    navigate("/admin/ql-thoi-gian-chieu/them-thoi-gian-chieu");
  };

  if (isLoading) return <Loader />;

  const transformedShowTimes = danhSachThoiGianChieu?.map(transformShowTimeForDisplay) || [];

  return (
    <ManagementPageLayout>
      {error ? (
        <Box sx={{ textAlign: 'center', mt: 3, mb: 2 }}>
          <Typography color="error" variant="body1">
            Không thể tải dữ liệu lịch chiếu. Bạn vẫn có thể tạo mới lịch chiếu.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={handleNavigateToAddShowtime}
          >
            Thêm thời gian chiếu mới
          </Button>
        </Box>
      ) : danhSachThoiGianChieu.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 3, mb: 2 }}>
          <Typography variant="body1">
            Không có dữ liệu lịch chiếu. Vui lòng tạo mới lịch chiếu.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={handleNavigateToAddShowtime}
          >
            Thêm thời gian chiếu mới
          </Button>
        </Box>
      ) : null}
      
      <ShowTimeTable
        showTimes={transformedShowTimes}
        onEdit={(id: string) => {
          const showTime = danhSachThoiGianChieu.find(
            (st) => st.showTimeId === id
          );
          console.log("Found showtime:", showTime);
        }}
      />
    </ManagementPageLayout>
  );
};

export default QuanLyPhongChieu;
