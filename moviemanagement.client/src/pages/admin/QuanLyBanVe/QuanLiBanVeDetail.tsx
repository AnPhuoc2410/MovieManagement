import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Card, CircularProgress, Typography } from "@mui/material";
import toast from "react-hot-toast";
import ManagementPageLayout from "../../../layouts/ManagementLayout";

const QuanLiBanVeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch chi tiết vé
  const { data: ticket, isLoading, error } = useQuery({
    queryKey: ["ticket", id],
    queryFn: async () => {
      const response = await fetch(`https://67d7d3cf9d5e3a10152c2879.mockapi.io/api/ticketdetail/${id}`);
      if (!response.ok) {
        throw new Error("Không thể lấy thông tin vé");
      }
      return response.json();
    },
    enabled: !!id,
  });

  if (isLoading) return <CircularProgress />;
  if (error) {
    toast.error("Không thể tải dữ liệu");
    return <Typography color="error">Lỗi khi tải dữ liệu</Typography>;
  }

  return (
    <ManagementPageLayout>
      <Card sx={{ p: 3, maxWidth: 600, margin: "auto", mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Chi tiết vé</Typography>
        <Typography variant="h6"><b>Tên Phim:</b> {ticket?.["Tên Phim"] || "N/A"}</Typography>
        <Typography variant="h6"><b>Người Mua:</b> {ticket?.["Người Mua"] || "N/A"}</Typography>
        <Typography variant="h6"><b>Ngày Chiếu:</b> {ticket?.["Ngày Chiếu"] || "N/A"}</Typography>
        <Typography variant="h6"><b>Giờ Chiếu:</b> {ticket?.["Giờ Chiếu"] || "N/A"}</Typography>
        <Typography variant="h6"><b>Giá:</b> {ticket?.["Giá"] ? `${ticket["Giá"]} VND` : "N/A"}</Typography>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
          <Button variant="contained" onClick={() => navigate("/admin/ban-ve")}>Quay lại</Button>
        </Box>
      </Card>
    </ManagementPageLayout>
  );
};

export default QuanLiBanVeDetail;
