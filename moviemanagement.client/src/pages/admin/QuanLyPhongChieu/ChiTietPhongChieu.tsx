import EventSeatIcon from "@mui/icons-material/EventSeat";
import ScreenshotMonitorIcon from "@mui/icons-material/ScreenshotMonitor";
import TheaterIcon from "@mui/icons-material/TheaterComedy";
import ChairIcon from "@mui/icons-material/Chair";
import GridViewIcon from "@mui/icons-material/GridView";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Tooltip,
  CircularProgress,
  Alert,
  AlertTitle,
  SelectChangeEvent,
  Paper,
  Stack,
  Badge,
  alpha,
  CardHeader,
  Avatar,
  useTheme,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../../../components/shared/Loading";
import ManagementPageLayout from "../../../layouts/ManagementLayout";
import toast from "react-hot-toast";
import AddIcon from "@mui/icons-material/Add";
import api from "../../../apis/axios.config";

// Define the SeatType interface if not already defined elsewhere
interface SeatType {
  seatTypeId: string;
  typeName: string;
  price: number;
  quantity?: number;
  isActive?: boolean;
}

// Define seat status enum
enum SeatStatus {
  Available = 0,
  Unavailable = 1,
  Sold = 2,
  Reserved = 3
}

// Interface for individual seat
interface Seat {
  seatId: string;
  atRow: string;
  atColumn: number;
  roomId: string;
  seatTypeId: string;
  isActive: boolean;
  seatStatus: SeatStatus;
}

const ChiTietPhongChieu = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const queryClient = useQueryClient();
  const theme = useTheme();

  // State for seat selection
  const [selectionMode, setSelectionMode] = useState<"row" | "column">("row");
  const [selectedSeatTypeId, setSelectedSeatTypeId] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isActiveStatus, setIsActiveStatus] = useState<boolean>(true);

  // Fetch room data
  const fetchRoom = async (id: string) => {
    const response = await api.get(`room/getroomInfo/${id}`);
    const roomData = response.data.data;
    return roomData;
  };

  // Fetch seat types
  const fetchSeatTypes = async () => {
    const response = await api.get(`seattype/all`);
    return response.data.data || [];
  };

  // Query for room data
  const { data: room, isLoading: isLoadingRoom } = useQuery(
    ["roomDetail", roomId],
    () => fetchRoom(roomId as string),
    { enabled: !!roomId },
  );

  // Query for seat types
  const { data: seatTypes, isLoading: isLoadingSeatTypes } = useQuery<SeatType[]>(
    "seatTypes",
    fetchSeatTypes,
    {
      onSuccess: (data) => {
        if (data && data.length > 0) {
          setSelectedSeatTypeId(data[0].seatTypeId);
        }
      }
    }
  );

  // Mutation for updating seats
  const updateSeats = async ({
    roomId,
    seatTypeId,
    index,
    mode
  }: {
    roomId: string;
    seatTypeId: string;
    index: number;
    mode: "row" | "column"
  }) => {
    setUpdateLoading(true);
    setUpdateSuccess(false);
    setUpdateError(null);

    try {
      // Get the seats in the selected row/column
      const roomResponse = await api.get(`room/getroomInfo/${roomId}`);
      const roomData = roomResponse.data.data;

      // Filter seats by row or column based on selection mode
      const selectedSeats = roomData.seats.filter((seat: any) =>
        mode === "row"
          ? seat.atRow === String.fromCharCode(65 + index)
          : seat.atColumn === index + 1
      );

      // Get the seat IDs
      const seatIds = selectedSeats.map((seat: any) => seat.seatId);

      // Update the seats with the new seat type
      const response = await api.put(
        `seat/updatebyroomid?seatTypeId=${seatTypeId}`,
        JSON.stringify(seatIds),
        {
          headers: {
            "Content-Type": "application/json-patch+json",
            "accept": "text/plain"
          }
        }
      );

      if (response.data.isSuccess) {
        setUpdateSuccess(true);
        toast.success(`${mode === "row" ? "Hàng" : "Cột"} ghế đã được cập nhật thành công!`);
        queryClient.invalidateQueries(["roomDetail", roomId]);
      } else {
        setUpdateError(response.data.message || "Cập nhật không thành công");
        toast.error(`Lỗi: ${response.data.message}`);
      }

      return response.data;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật ghế";
      setUpdateError(errorMsg);
      toast.error(`Lỗi: ${errorMsg}`);
      throw error;
    } finally {
      setUpdateLoading(false);
    }
  };

  // Add a new row to the room
  const addRow = async (roomId: string, seatTypeId: string) => {
    setUpdateLoading(true);
    setUpdateSuccess(false);
    setUpdateError(null);

    try {
      // Use the API endpoint for adding a row as shown in the screenshot
      const response = await api.post(
        `seat/addrowbyroomid?roomId=${roomId}&seatTypeId=${seatTypeId}`,
        '',
        {
          headers: {
            "accept": "text/plain"
          }
        }
      );

      if (response.data.isSuccess) {
        setUpdateSuccess(true);
        toast.success("Đã thêm hàng ghế mới thành công!");
        queryClient.invalidateQueries(["roomDetail", roomId]);
      } else {
        setUpdateError(response.data.message || "Thêm hàng không thành công");
        toast.error(`Lỗi: ${response.data.message}`);
      }

      return response.data;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Đã xảy ra lỗi khi thêm hàng ghế";
      setUpdateError(errorMsg);
      toast.error(`Lỗi: ${errorMsg}`);
      throw error;
    } finally {
      setUpdateLoading(false);
    }
  };

  // Add a new column to the room
  const addColumn = async (roomId: string, seatTypeId: string) => {
    setUpdateLoading(true);
    setUpdateSuccess(false);
    setUpdateError(null);

    try {
      // Use the API endpoint for adding a column as shown in the screenshot
      const response = await api.post(
        `seat/addcolumnbyroomid?roomId=${roomId}&seatTypeId=${seatTypeId}`,
        '',
        {
          headers: {
            "accept": "text/plain"
          }
        }
      );

      if (response.data.isSuccess) {
        setUpdateSuccess(true);
        toast.success("Đã thêm cột ghế mới thành công!");
        queryClient.invalidateQueries(["roomDetail", roomId]);
      } else {
        setUpdateError(response.data.message || "Thêm cột không thành công");
        toast.error(`Lỗi: ${response.data.message}`);
      }

      return response.data;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Đã xảy ra lỗi khi thêm cột ghế";
      setUpdateError(errorMsg);
      toast.error(`Lỗi: ${errorMsg}`);
      throw error;
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: "row" | "column") => {
    setSelectionMode(newValue);
    setSelectedIndex(null); // Reset selection when changing modes
  };

  const handleSeatTypeChange = (event: SelectChangeEvent) => {
    setSelectedSeatTypeId(event.target.value as string);
  };

  const handleIndexSelection = (index: number) => {
    setSelectedIndex(index === selectedIndex ? null : index);
  };

  const handleUpdateSeats = async () => {
    if (!roomId || !selectedSeatTypeId || selectedIndex === null) {
      toast.error("Vui lòng chọn loại ghế và vị trí để cập nhật");
      return;
    }

    try {
      await updateSeats({
        roomId,
        seatTypeId: selectedSeatTypeId,
        index: selectedIndex,
        mode: selectionMode
      });
    } catch (error) {
      console.error("Error updating seats:", error);
    }
  };

  // Find selected seat type name
  const getSelectedSeatTypeName = (): string => {
    if (!seatTypes || !selectedSeatTypeId) return '';
    const seatType = seatTypes.find(type => type.seatTypeId === selectedSeatTypeId);
    return seatType ? seatType.typeName : '';
  };

  // Get seat type price
  const getSelectedSeatTypePrice = (): number => {
    if (!seatTypes || !selectedSeatTypeId) return 0;
    const seatType = seatTypes.find(type => type.seatTypeId === selectedSeatTypeId);
    return seatType ? seatType.price : 0;
  };

  const handleAddRow = async () => {
    if (!roomId || !selectedSeatTypeId) {
      toast.error("Vui lòng chọn loại ghế để thêm hàng");
      return;
    }

    try {
      await addRow(roomId, selectedSeatTypeId);
    } catch (error) {
      console.error("Error adding row:", error);
    }
  };

  const handleAddColumn = async () => {
    if (!roomId || !selectedSeatTypeId) {
      toast.error("Vui lòng chọn loại ghế để thêm cột");
      return;
    }

    try {
      await addColumn(roomId, selectedSeatTypeId);
    } catch (error) {
      console.error("Error adding column:", error);
    }
  };

  // Get string value for seat status
  const getSeatStatusString = (status: SeatStatus): string => {
    switch (status) {
      case SeatStatus.Available:
        return "Available";
      case SeatStatus.Unavailable:
        return "Unavailable";
      case SeatStatus.Sold:
        return "Sold";
      case SeatStatus.Reserved:
        return "Reserved";
      default:
        return "Available";
    }
  };

  // Update single seat status
  const updateSeatStatus = async (seatId: string, seat: any) => {
    setUpdateLoading(true);
    setUpdateSuccess(false);
    setUpdateError(null);

    try {
      // Toggle isActive status when clicking on a seat
      await updateSeatActiveStatus([seatId], !seat.isActive);
      return true;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật ghế";
      setUpdateError(errorMsg);
      toast.error(`Lỗi: ${errorMsg}`);
      throw error;
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle seat click
  const handleSeatClick = async (seat: any) => {
    if (updateLoading) return;

    try {
      await updateSeatStatus(seat.seatId, seat);
    } catch (error) {
      console.error("Error updating seat status:", error);
    }
  };

  // Get color for seat status
  const getSeatStatusColor = (status: number) => {
    switch (status) {
      case SeatStatus.Available:
        return { bg: "#ffffff", border: "#e0e0e0", text: "#5f6368" };
      case SeatStatus.Unavailable:
        return { bg: "#f44336", border: "#d32f2f", text: "#ffffff" };
      case SeatStatus.Sold:
        return { bg: "#757575", border: "#616161", text: "#ffffff" };
      case SeatStatus.Reserved:
        return { bg: "#ffc107", border: "#ffa000", text: "#212121" };
      default:
        return { bg: "#ffffff", border: "#e0e0e0", text: "#5f6368" };
    }
  };

  // Update isActive status for selected seats
  const updateSeatActiveStatus = async (seatIds: string[], isActive: boolean) => {
    setUpdateLoading(true);
    setUpdateSuccess(false);
    setUpdateError(null);

    try {
      // Update seats active status using the API
      const response = await axios.put(
        `https://localhost:7119/api/seat/updatebylist?isActived=${isActive}`,
        JSON.stringify(seatIds),
        {
          headers: {
            "Content-Type": "application/json-patch+json",
            "accept": "text/plain"
          }
        }
      );

      if (response.data.isSuccess) {
        setUpdateSuccess(true);
        toast.success(`Đã cập nhật trạng thái kích hoạt của ${seatIds.length} ghế!`);
        queryClient.invalidateQueries(["roomDetail", roomId]);
        setSelectedSeats([]);
      } else {
        setUpdateError(response.data.message || "Cập nhật không thành công");
        toast.error(`Lỗi: ${response.data.message}`);
      }

      return response.data;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật trạng thái ghế";
      setUpdateError(errorMsg);
      toast.error(`Lỗi: ${errorMsg}`);
      throw error;
    } finally {
      setUpdateLoading(false);
    }
  };

  // Toggle seat selection for bulk update
  const toggleSeatSelection = (seatId: string) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  // Handle the isActive status change
  const handleIsActiveChange = (event: SelectChangeEvent<string>) => {
    setIsActiveStatus(event.target.value === 'true');
  };

  // Handle bulk update of selected seats
  const handleUpdateSeatsActiveStatus = async () => {
    if (selectedSeats.length === 0) {
      toast.error("Vui lòng chọn ít nhất một ghế để cập nhật");
      return;
    }

    try {
      await updateSeatActiveStatus(selectedSeats, isActiveStatus);
    } catch (error) {
      console.error("Error updating seats active status:", error);
    }
  };

  // Create a single seat at specific position
  const createSeatAtPosition = async (roomId: string, seatTypeId: string, row: string, column: number) => {
    setUpdateLoading(true);
    setUpdateSuccess(false);
    setUpdateError(null);

    try {
      // Create the seat using the API
      const response = await axios.post(
        `https://localhost:7119/api/seat/create`,
        {
          roomId: roomId,
          seatTypeId: seatTypeId,
          atRow: row,
          atColumn: column
        },
        {
          headers: {
            "Content-Type": "application/json",
            "accept": "text/plain"
          }
        }
      );

      if (response.data.isSuccess) {
        setUpdateSuccess(true);
        toast.success(`Đã tạo ghế ${row}${column} thành công!`);
        queryClient.invalidateQueries(["roomDetail", roomId]);
        return true;
      } else {
        setUpdateError(response.data.message || "Tạo ghế không thành công");
        toast.error(`Lỗi: ${response.data.message}`);
        return false;
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Đã xảy ra lỗi khi tạo ghế";
      setUpdateError(errorMsg);
      toast.error(`Lỗi: ${errorMsg}`);
      throw error;
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle create seat at empty position
  const handleCreateSeat = async (rowLetter: string, colNumber: number) => {
    if (!roomId || !selectedSeatTypeId || updateLoading) {
      toast.error("Vui lòng chọn loại ghế để tạo ghế mới");
      return;
    }

    try {
      await createSeatAtPosition(roomId, selectedSeatTypeId, rowLetter, colNumber);
    } catch (error) {
      console.error("Error creating seat:", error);
    }
  };

  // For debugging
  useEffect(() => {
    if (room) {
      console.log("Room data in component:", room);
      console.log("Room seats:", room.seats);
    }
  }, [room]);

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

  if (isLoadingRoom || isLoadingSeatTypes) return <Loader />;

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

  // Check if room has seats or not
  const hasSeats = room.seats && room.seats.length > 0;

  return (
    <ManagementPageLayout>
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin/ql-phong-chieu")}
          sx={{ mb: 2 }}
        >
          Quay lại danh sách phòng
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'primary.main',
            color: 'white',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <TheaterIcon sx={{ mr: 2, fontSize: 28 }} />
          <Box>
            <Typography variant="h5" component="h1" fontWeight="bold">
              {room.roomName}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Mã phòng: {room.roomId}
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Grid container spacing={3}>
        {/* Room Information Card */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Room Details */}
            <Card sx={{
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <CardHeader
                title="Thông tin phòng"
                titleTypographyProps={{ fontWeight: 'bold' }}
                avatar={
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <GridViewIcon />
                  </Avatar>
                }
                sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText' }}
              />
              <Divider />
              <Box sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{
                      bgcolor: alpha('#f5f5f5', 0.5),
                      p: 2,
                      borderRadius: 2,
                      height: '100%'
                    }}>
                      <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                        Số hàng ghế
                      </Typography>
                      <Typography variant="h4" fontWeight="medium" color="primary">
                        {room.row}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{
                      bgcolor: alpha('#f5f5f5', 0.5),
                      p: 2,
                      borderRadius: 2,
                      height: '100%'
                    }}>
                      <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                        Số cột
                      </Typography>
                      <Typography variant="h4" fontWeight="medium" color="primary">
                        {room.column}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{
                      bgcolor: alpha('#f5f5f5', 0.5),
                      p: 2,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <Box>
                        <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                          Tổng số ghế
                        </Typography>
                        <Typography variant="h4" fontWeight="medium" color="primary">
                          {room.total}
                        </Typography>
                      </Box>
                      <ChairIcon sx={{ fontSize: 48, color: theme.palette.primary.light, opacity: 0.7 }} />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Card>

            {/* Seat Type Update Controls */}
            <Card sx={{
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <CardHeader
                title="Cập nhật loại ghế"
                titleTypographyProps={{ fontWeight: 'bold' }}
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <EventSeatIcon />
                  </Avatar>
                }
                sx={{
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText'
                }}
              />
              <Divider />
              <Box sx={{ p: 3 }}>
                {!hasSeats ? (
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    py: 4
                  }}>
                    <EventSeatIcon sx={{ color: 'grey.400', fontSize: 60, mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                      Phòng hiện không có ghế nào
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 300 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/admin/ql-phong-chieu")}
                        startIcon={<AddIcon />}
                      >
                        Trở về trang danh sách phòng để tạo ghế
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Tabs
                      value={selectionMode}
                      onChange={handleTabChange}
                      variant="fullWidth"
                      indicatorColor="primary"
                      textColor="primary"
                      sx={{
                        mb: 3,
                        '& .MuiTab-root': {
                          borderRadius: 1,
                          mr: 1,
                          fontWeight: 'medium',
                          '&.Mui-selected': {
                            backgroundColor: alpha('#bbdefb', 0.5),
                          },
                        }
                      }}
                    >
                      <Tab
                        value="row"
                        label="Chọn hàng"
                        icon={<Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ChairIcon sx={{ mr: 0.5, fontSize: 18 }} />
                          <ChairIcon sx={{ mr: 0.5, fontSize: 18 }} />
                          <ChairIcon sx={{ fontSize: 18 }} />
                        </Box>}
                        iconPosition="start"
                      />
                      <Tab
                        value="column"
                        label="Chọn cột"
                        icon={<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <ChairIcon sx={{ fontSize: 16 }} />
                          <ChairIcon sx={{ fontSize: 16 }} />
                        </Box>}
                        iconPosition="start"
                      />
                    </Tabs>

                    <Box sx={(theme) => ({
                      mb: 3,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: getSelectedSeatTypeName()
                        ? alpha(theme.palette.primary.light, 0.2)
                        : alpha('#f5f5f5', 0.2),
                      border: '1px solid',
                      borderColor: getSelectedSeatTypeName()
                        ? alpha(theme.palette.primary.main, 0.5)
                        : alpha('#e0e0e0', 0.5),
                    })}>
                      <FormControl fullWidth>
                        <InputLabel>Loại ghế</InputLabel>
                        <Select
                          value={selectedSeatTypeId}
                          onChange={handleSeatTypeChange}
                          label="Loại ghế"
                          sx={{
                            '& .MuiSelect-select': {
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }
                          }}
                        >
                          {seatTypes?.map((type) => (
                            <MenuItem
                              key={type.seatTypeId}
                              value={type.seatTypeId}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}
                            >
                              <EventSeatIcon
                                color={selectedSeatTypeId === type.seatTypeId ? "primary" : "action"}
                                fontSize="small"
                              />
                              <span>{type.typeName}</span>
                              <Chip
                                size="small"
                                label={`${type.price.toLocaleString('vi-VN')}đ`}
                                color="primary"
                                variant="outlined"
                                sx={{ ml: 'auto' }}
                              />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {getSelectedSeatTypeName() && (
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2">
                            Đã chọn: <strong>{getSelectedSeatTypeName()}</strong>
                          </Typography>
                          <Chip
                            label={`${getSelectedSeatTypePrice().toLocaleString('vi-VN')}đ`}
                            color="secondary"
                            size="small"
                          />
                        </Box>
                      )}
                    </Box>

                    <Typography variant="body1" fontWeight="medium" sx={{ mb: 1.5 }}>
                      {selectionMode === "row" ? "Chọn hàng để cập nhật:" : "Chọn cột để cập nhật:"}
                    </Typography>

                    <Box sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      mb: 3,
                      p: 2,
                      borderRadius: 1,
                      bgcolor: '#f5f5f5'
                    }}>
                      {Array.from({ length: selectionMode === "row" ? room.row : room.column }).map((_, idx) => (
                        <Chip
                          key={idx}
                          label={selectionMode === "row" ? String.fromCharCode(65 + idx) : (idx + 1)}
                          onClick={() => handleIndexSelection(idx)}
                          color={selectedIndex === idx ? "primary" : "default"}
                          variant={selectedIndex === idx ? "filled" : "outlined"}
                          sx={{
                            cursor: "pointer",
                            fontWeight: 'medium',
                            minWidth: 38,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 3px 5px rgba(0,0,0,0.1)'
                            }
                          }}
                        />
                      ))}
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={12} sm={6}>
                        <Tooltip title={`Thêm hàng mới với ghế loại: ${getSelectedSeatTypeName()} (${getSelectedSeatTypePrice().toLocaleString('vi-VN')}đ)`}>
                          <span>
                            <Button
                              variant="outlined"
                              color="primary"
                              fullWidth
                              onClick={handleAddRow}
                              disabled={!selectedSeatTypeId || updateLoading}
                              sx={{
                                py: 1.2,
                                borderRadius: 2,
                                fontWeight: 'medium',
                              }}
                              startIcon={<EventSeatIcon />}
                            >
                              Thêm hàng mới
                            </Button>
                          </span>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Tooltip title={`Thêm cột mới với ghế loại: ${getSelectedSeatTypeName()} (${getSelectedSeatTypePrice().toLocaleString('vi-VN')}đ)`}>
                          <span>
                            <Button
                              variant="outlined"
                              color="primary"
                              fullWidth
                              onClick={handleAddColumn}
                              disabled={!selectedSeatTypeId || updateLoading}
                              sx={{
                                py: 1.2,
                                borderRadius: 2,
                                fontWeight: 'medium',
                              }}
                              startIcon={<EventSeatIcon />}
                            >
                              Thêm cột mới
                            </Button>
                          </span>
                        </Tooltip>
                      </Grid>
                    </Grid>

                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleUpdateSeats}
                      disabled={selectedIndex === null || !selectedSeatTypeId || updateLoading}
                      sx={{
                        py: 1.2,
                        borderRadius: 2,
                        fontWeight: 'bold',
                        boxShadow: 2
                      }}
                      startIcon={updateLoading ? undefined : <CheckCircleOutlineIcon />}
                    >
                      {updateLoading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        `Cập nhật ${selectionMode === "row" ? "hàng" : "cột"} đã chọn`
                      )}
                    </Button>
                  </>
                )}
              </Box>
            </Card>
          </Stack>
        </Grid>

        {/* Room Visualization Card */}
        <Grid item xs={12} md={8}>
          <Card sx={{
            p: 0,
            overflow: 'hidden',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            height: '100%'
          }}>
            <CardHeader
              title="Sơ đồ phòng chiếu"
              titleTypographyProps={{ fontWeight: 'bold' }}
              avatar={
                <Avatar sx={{ bgcolor: '#1e88e5' }}>
                  <GridViewIcon />
                </Avatar>
              }
              sx={{ bgcolor: '#bbdefb' }}
            />
            <Divider />

            <Box sx={{ p: 3 }}>
              {/* Screen */}
              <Box
                sx={{
                  width: "80%",
                  height: "40px",
                  background: "linear-gradient(to bottom, #3f51b5, #c5cae9)",
                  margin: "0 auto 50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "4px",
                  position: "relative",
                  overflow: "hidden",
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: "-150%",
                    width: "150%",
                    height: "100%",
                    background: "rgba(255, 255, 255, 0.3)",
                    transform: "skewX(-45deg)",
                    animation: "moveLight 3s ease-in-out infinite",
                  },
                  "@keyframes moveLight": {
                    "0%": { left: "-150%" },
                    "50%": { left: "150%" },
                    "100%": { left: "-150%" },
                  },
                  boxShadow:
                    "0 4px 12px rgba(0,0,0,0.3), 0 0 20px rgba(116, 132, 214, 0.8)",
                }}
              >
                <ScreenshotMonitorIcon sx={{ color: "white", mr: 1 }} />
                <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 'medium' }}>
                  Màn hình
                </Typography>
              </Box>

              {!hasSeats ? (
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 400
                }}>
                  <EventSeatIcon sx={{ color: 'grey.300', fontSize: 100, mb: 3 }} />
                  <Typography variant="h5" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                    Phòng chưa có ghế nào
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center', maxWidth: 500 }}>
                    Vui lòng trở về trang danh sách phòng và nhấn vào nút "Tạo ghế" để tạo ghế cho phòng chiếu này.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/admin/ql-phong-chieu")}
                    startIcon={<ArrowBackIcon />}
                  >
                    Quay lại danh sách phòng
                  </Button>
                </Box>
              ) : (
                <>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 2,
                      bgcolor: '#f8f9fa',
                      mb: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                  >
                    {/* Column Headers */}
                    <Box sx={{
                      display: "flex",
                      mb: 2,
                      justifyContent: 'center',
                      width: 'fit-content'
                    }}>
                      {Array.from({ length: room.column }).map((_, idx) => (
                        <Tooltip key={idx} title={`Chọn cột ${idx + 1}`}>
                          <Box
                            sx={{
                              width: 40,
                              height: 30,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              mx: "4px",
                              cursor: "pointer",
                              bgcolor: selectionMode === "column" && selectedIndex === idx ?
                                theme.palette.primary.main :
                                "#eeeeee",
                              color: selectionMode === "column" && selectedIndex === idx ?
                                "white" :
                                "text.primary",
                              borderRadius: 2,
                              fontSize: "0.9rem",
                              transition: "all 0.2s",
                              fontWeight: "bold",
                              "&:hover": {
                                bgcolor: selectionMode === "column" ?
                                  alpha(theme.palette.primary.main, 0.7) :
                                  "#e0e0e0",
                              }
                            }}
                            onClick={() => {
                              if (selectionMode === "column") handleIndexSelection(idx);
                            }}
                          >
                            {idx + 1}
                          </Box>
                        </Tooltip>
                      ))}
                    </Box>

                    {/* Seats Layout with Row Headers */}
                    <Box sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%"
                    }}>
                      {/* Row Headers */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          mr: 2,
                        }}
                      >
                        {Array.from({ length: room.row }).map((_, rowIdx) => (
                          <Tooltip key={rowIdx} title={`Chọn hàng ${String.fromCharCode(65 + rowIdx)}`}>
                            <Box
                              sx={{
                                width: 30,
                                height: 40,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                                bgcolor: selectionMode === "row" && selectedIndex === rowIdx ?
                                  theme.palette.primary.main :
                                  "#eeeeee",
                                color: selectionMode === "row" && selectedIndex === rowIdx ?
                                  "white" :
                                  "text.primary",
                                borderRadius: 2,
                                fontSize: "0.9rem",
                                fontWeight: "bold",
                                transition: "all 0.2s",
                                "&:hover": {
                                  bgcolor: selectionMode === "row" ?
                                    alpha(theme.palette.primary.main, 0.7) :
                                    "#e0e0e0",
                                }
                              }}
                              onClick={() => {
                                if (selectionMode === "row") handleIndexSelection(rowIdx);
                              }}
                            >
                              {String.fromCharCode(65 + rowIdx)}
                            </Box>
                          </Tooltip>
                        ))}
                      </Box>

                      {/* Seats */}
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: `repeat(${room.column}, 40px)`,
                          gridTemplateRows: `repeat(${room.row}, 40px)`,
                          gap: "8px",
                          justifyContent: "center"
                        }}
                      >
                        {Array.from({ length: room.row * room.column }).map((_, index) => {
                          const row = Math.floor(index / room.column);
                          const col = index % room.column;
                          const rowLetter = String.fromCharCode(65 + row);
                          const colNumber = col + 1;
                          const seatLabel = `${rowLetter}${colNumber}`;

                          // Find the seat in room.seats that matches this position
                          const seat = room.seats?.find((s: any) =>
                            s.atRow === rowLetter && s.atColumn === colNumber
                          );

                          // For debugging
                          if (index === 0) {
                            console.log("First seat search:", {
                              rowLetter,
                              colNumber,
                              foundSeat: !!seat,
                              allSeats: room.seats?.slice(0, 3)  // Log first 3 seats
                            });
                          }

                          // Highlight seats in selected row/column
                          const isHighlighted =
                            (selectionMode === "row" && selectedIndex === row) ||
                            (selectionMode === "column" && selectedIndex === col);

                          // Check if seat is selected for bulk update
                          const isSelected = seat && selectedSeats.includes(seat.seatId);

                          // Get colors based on seat status
                          const statusColors = seat
                            ? getSeatStatusColor(seat.status)
                            : getSeatStatusColor(SeatStatus.Available);

                          // Show inactive seats with reduced opacity
                          const isInactive = seat && !seat.isActive;

                          return (
                            <Tooltip
                              key={`seat-${index}`}
                              title={seat
                                ? `${seatLabel} - ${
                                  seat.status === SeatStatus.Available ? "Có sẵn" :
                                  seat.status === SeatStatus.Unavailable ? "Không khả dụng" :
                                  seat.status === SeatStatus.Sold ? "Đã bán" :
                                  seat.status === SeatStatus.Reserved ? "Đã đặt" : "Không xác định"
                                }${isInactive ? " - Đã vô hiệu hóa" : " - Đã kích hoạt"}${isSelected ? " - Đã chọn" : ""}`
                                : `${seatLabel} - Vị trí trống`
                              }
                            >
                              {seat ? (
                                <Box
                                  onClick={(event) =>
                                    event.ctrlKey || event.metaKey
                                      ? toggleSeatSelection(seat.seatId)
                                      : handleSeatClick(seat)
                                  }
                                  sx={{
                                    width: "40px",
                                    height: "40px",
                                    backgroundColor: isSelected
                                      ? "#9c27b0" // Purple when selected
                                      : isHighlighted
                                        ? theme.palette.primary.main
                                        : statusColors.bg,
                                    border: "1px solid",
                                    borderColor: isSelected
                                      ? "#7b1fa2"
                                      : isHighlighted
                                        ? theme.palette.primary.dark
                                        : statusColors.border,
                                    borderRadius: "4px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: "0.9rem",
                                    color: isSelected || isHighlighted
                                      ? "white"
                                      : statusColors.text,
                                    transition: "all 0.15s ease",
                                    boxShadow: isHighlighted
                                      ? 'none'
                                      : isSelected
                                        ? '0 0 0 2px #9c27b0'
                                        : 'inset 0 -2px 0 0 rgba(0,0,0,0.1)',
                                    cursor: "pointer",
                                    opacity: isInactive ? 0.3 : 1,
                                    "&:hover": {
                                      transform: "translateY(-2px)",
                                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                      filter: "brightness(0.95)",
                                    },
                                    position: "relative",
                                    "&:before": isInactive ? {
                                      content: '""',
                                      position: "absolute",
                                      width: "100%",
                                      height: "2px",
                                      backgroundColor: "#f44336",
                                      top: "50%",
                                      transform: "translateY(-50%) rotate(45deg)"
                                    } : {}
                                  }}
                                >
                                  {seatLabel}
                                </Box>
                              ) : (
                                <Box
                                  onClick={() => handleCreateSeat(rowLetter, colNumber)}
                                  sx={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "4px",
                                    border: "1px dashed #ccc",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: "#aaa",
                                    fontSize: "0.8rem",
                                    cursor: "pointer",
                                    "&:hover": {
                                      border: "1px dashed #2196f3",
                                      backgroundColor: alpha("#bbdefb", 0.3),
                                      transform: "translateY(-2px)",
                                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                      color: "primary.main"
                                    }
                                  }}
                                >
                                  {seatLabel}
                                </Box>
                              )}
                            </Tooltip>
                          );
                        })}
                      </Box>
                    </Box>
                  </Paper>

                  <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha('#e3f2fd', 0.6),
                  }}>
                    <EventSeatIcon sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
                    <Typography variant="body2" color="primary.dark" fontWeight="medium">
                      Nhấp vào vị trí trống để tạo ghế mới với loại ghế đã chọn
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </ManagementPageLayout>
  );
};

export default ChiTietPhongChieu;
