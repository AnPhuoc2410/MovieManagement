import type { } from "@mui/x-charts/themeAugmentation";
import type { } from "@mui/x-data-grid-pro/themeAugmentation";
import type { } from "@mui/x-date-pickers/themeAugmentation";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { ShowTime as ShowTimeType } from "../../../types/showtime.types";
import ManagementPageLayout from "../../../layouts/ManagementLayout";
import ShowTimeTable, { ShowTime as ShowTimeDisplay } from "./BangShowTime";
import Loader from "../../../components/shared/Loading/LoadingScreen";
import api from "../../../apis/axios.config";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Box, Typography, Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { t } from "i18next";

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

const transformShowTimeForDisplay = (
  showtime: ShowTimeType,
): ShowTimeDisplay => {
  // Convert the Date object to string for consistent handling in DataGrid
  const formattedStartTime =
    showtime.startTime instanceof Date
      ? showtime.startTime.toISOString()
      : String(showtime.startTime);

  return {
    id: showtime.showTimeId, // DataGrid requires a unique id field
    showTimeId: showtime.showTimeId,
    movieId: showtime.movieId,
    roomId: showtime.roomId,
    startTime: formattedStartTime,
    endTime: showtime.endTime,
    movie: {
      movieName: showtime.movie?.movieName || "N/A",
    },
    room: {
      roomName: showtime.room?.roomName || "N/A",
    },
  };
};

const QuanLyPhongChieu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    data: danhSachThoiGianChieu = [],
    isLoading,
    error,
    refetch
  } = useQuery<ShowTimeType[]>("ThoiGianChieuData", fetchShowtimes, {
    onError: (error) => {
      console.error("Query error:", error);
    },
    retry: 1,
    // Enable auto-refresh with React Query's refetch interval
    refetchInterval: 30000, // Refresh data every 30 seconds
    refetchOnWindowFocus: true, // Also refresh when the window regains focus
  });

  // Handle refresh based on location state
  useEffect(() => {
    // Check if there's a refresh signal in the location state
    if (location.state && location.state.refresh) {
      console.log("Refresh signal detected, refetching data...");
      // Invalidate and refetch data
      queryClient.invalidateQueries("ThoiGianChieuData");
      refetch();

      // Display success message if provided
      if (location.state.message) {
        setSuccessMessage(location.state.message);
      }

      // Clear the state to prevent repeated refreshes
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, queryClient, refetch, navigate]);

  // Initial data load
  useEffect(() => {
    // Initial data fetch when component mounts
    refetch();

    // Return cleanup function
    return () => {
      // Cancel any pending requests when component unmounts
    };
  }, [refetch]);

  const handleNavigateToAddShowtime = () => {
    navigate("/admin/ql-thoi-gian-chieu/them-thoi-gian-chieu");
  };

  // Handle close of success message
  const handleCloseSuccessMessage = () => {
    setSuccessMessage(null);
  };

  if (isLoading) return <Loader />;

  const transformedShowTimes =
    danhSachThoiGianChieu?.map(transformShowTimeForDisplay) || [];

  return (
    <ManagementPageLayout>
      {error ? (
        <Box sx={{ textAlign: 'center', mt: 3, mb: 2 }}>
          <Typography color="error" variant="body1">
            Không thể tải dữ liệu lịch chiếu. Bạn vẫn có thể tạo mới lịch chiếu.
          </Typography>
        </Box>
      ) : danhSachThoiGianChieu.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 3, mb: 2 }}>
          <Typography variant="body1">
            Không có dữ liệu lịch chiếu. Vui lòng tạo mới lịch chiếu.
          </Typography>
        </Box>
      ) : null}

      <ShowTimeTable
        showTimes={transformedShowTimes}
        onEdit={(id: string) => {
          const showTime = danhSachThoiGianChieu.find(
            (st) => st.showTimeId === id,
          );
          console.log("Found showtime:", showTime);
        }}
        onRefreshData={() => {
          queryClient.invalidateQueries("ThoiGianChieuData");
          refetch();
        }}
      />
    </ManagementPageLayout>
  );
};

export default QuanLyPhongChieu;
