import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid-pro/themeAugmentation";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import { useQuery } from "react-query";
import axios from "axios";
import { ShowTime as ShowTimeType } from "../../../types/showtime.types";
import ManagementPageLayout from "../../../layouts/ManagementLayout";
import ShowTimeTable, { ShowTime as ShowTimeDisplay } from "./BangShowTime";
import Loader from "../../../components/shared/Loading/LoadingScreen";

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  isSuccess: boolean;
  data: T;
}

const fetchShowtimes = async (): Promise<ShowTimeType[]> => {
  const response = await axios.get<ApiResponse<ShowTimeType[]>>("https://localhost:7119/api/showtime/getallshowtime");
  if (!response.data.isSuccess) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

const transformShowTimeForDisplay = (showtime: ShowTimeType): ShowTimeDisplay => {
  return {
    ...showtime,
    startTime: new Date(showtime.startTime).toLocaleString(),
    endTime: new Date(showtime.endTime).toLocaleString(),
  };
};

const QuanLyPhongChieu: React.FC = () => {
  const {
    data: danhSachThoiGianChieu = [],
    isLoading,
    error,
  } = useQuery<ShowTimeType[]>("ThoiGianChieuData", fetchShowtimes);

  if (isLoading) return <Loader />;
  if (error) return <div>Failed to fetch data</div>;

  const transformedShowTimes = danhSachThoiGianChieu.map(transformShowTimeForDisplay);

  return (
    <ManagementPageLayout>
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
