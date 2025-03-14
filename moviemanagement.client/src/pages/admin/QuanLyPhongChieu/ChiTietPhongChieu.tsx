import EventSeatIcon from "@mui/icons-material/EventSeat";
import ScreenshotMonitorIcon from "@mui/icons-material/ScreenshotMonitor";
import TheaterIcon from "@mui/icons-material/TheaterComedy";
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { fetchRoomDetail } from "../../../apis/mock.apis";
import Loader from "../../../components/shared/Loading";
import ManagementPageLayout from "../../../layouts/ManagementLayout";

const ChiTietPhongChieu = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { data: room, isLoading } = useQuery(
    ["roomDetail", roomId],
    () => fetchRoomDetail(roomId as string),
    { enabled: !!roomId },
  );

  if (!roomId) {
    return (
      <ManagementPageLayout>
        <Card sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="error">
            Không tìm thấy mã phòng chiếu
          </Typography>
        </Card>
      </ManagementPageLayout>
    );
  }

  if (isLoading) return <Loader />;

  if (!room) {
    return (
      <ManagementPageLayout>
        <Card sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="error">
            Không tìm thấy thông tin phòng chiếu
          </Typography>
        </Card>
      </ManagementPageLayout>
    );
  }

  return (
    <ManagementPageLayout>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
        <TheaterIcon sx={{ mr: 1, color: "primary.main" }} />
        <Typography variant="h5" component="h1">
          Chi tiết phòng: {room.name}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Room Information Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: "100%" }}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
              Thông tin phòng
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Chip
                label={`Mã phòng: ${room.roomId}`}
                color="primary"
                size="medium"
                sx={{ fontWeight: "bold" }}
              />
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  Số hàng ghế
                </Typography>
                <Typography variant="h6">{room.row}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  Số cột
                </Typography>
                <Typography variant="h6">{room.column}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  Tổng số ghế
                </Typography>
                <Typography variant="h6">{room.total}</Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Room Visualization Card */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography
              variant="h4"
              sx={{
                mb: 2,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
              }}
            >
              <EventSeatIcon sx={{ mr: 1 }} />
              Sơ đồ phòng chiếu
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* Screen */}
            <Box
              sx={{
                width: "80%",
                height: "30px",
                background: "linear-gradient(to bottom, #3f51b5, #c5cae9)",
                margin: "0 auto 40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "4px",
                position: "relative",
                overflow: "hidden", // Prevents overflow of the light animation
                "&:before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "-150%",
                  width: "150%",
                  height: "100%",
                  background: "rgba(255, 255, 255, 0.3)", // Light color
                  transform: "skewX(-45deg)", // Tilt the light
                  animation: "moveLight 3s ease-in-out infinite", // Infinite movement
                },
                "@keyframes moveLight": {
                  "0%": { left: "-150%" },
                  "50%": { left: "150%" }, // Move across the box
                  "100%": { left: "-150%" },
                },
                boxShadow:
                  "0 4px 8px rgba(0,0,0,0.2), 0 0 15px rgba(255,255,255,0.5)", // Add glow
              }}
            >
              <ScreenshotMonitorIcon sx={{ color: "white", mr: 1 }} />
              <Typography variant="subtitle2" sx={{ color: "white" }}>
                Màn hình
              </Typography>
            </Box>

            {/* Seats Layout */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: `repeat(${room.column}, 36px)`,
                gap: "8px",
                justifyContent: "center",
                mb: 3,
              }}
            >
              {Array.from({ length: room.row * room.column }).map(
                (_, index) => {
                  const row = Math.floor(index / room.column);
                  const col = index % room.column;
                  const seatLabel = `${String.fromCharCode(65 + row)}${col + 1}`;

                  return (
                    <Box
                      key={index}
                      sx={{
                        width: "36px",
                        height: "36px",
                        backgroundColor: "#f5f5f5",
                        border: "1px solid #bdbdbd",
                        borderRadius: "4px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "12px",
                        transition: "all 0.2s",
                        "&:hover": {
                          backgroundColor: "#e0e0e0",
                          transform: "scale(1.05)",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        },
                      }}
                    >
                      {seatLabel}
                    </Box>
                  );
                },
              )}
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                * Chú thích: Các ghế được đánh số theo định dạng [Hàng][Cột]
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "end",
            mt: 2,
            ml: 3,
            gap: 2,
          }}
        >
          <Button variant="contained">Lưu</Button>
          <Button
            variant="contained"
            onClick={() => {
              navigate("/admin/ql-phong-chieu");
            }}
          >
            Quay lại
          </Button>
        </Box>
      </Grid>
    </ManagementPageLayout>
  );
};

export default ChiTietPhongChieu;
