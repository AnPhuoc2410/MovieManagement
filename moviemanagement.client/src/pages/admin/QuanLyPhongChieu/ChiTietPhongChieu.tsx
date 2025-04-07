import EventSeatIcon from "@mui/icons-material/EventSeat";
import ScreenshotMonitorIcon from "@mui/icons-material/ScreenshotMonitor";
import TheaterIcon from "@mui/icons-material/TheaterComedy";
import ChairIcon from "@mui/icons-material/Chair";
import GridViewIcon from "@mui/icons-material/GridView";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../../../components/shared/Loading";
import ManagementPageLayout from "../../../layouts/ManagementLayout";
import toast from "react-hot-toast";
import AddIcon from "@mui/icons-material/Add";
import api from "../../../apis/axios.config";
import { t } from "i18next";
import { SeatType } from "../../../types/seattype.types";

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

  // Delete confirmation dialog states
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [seatToDelete, setSeatToDelete] = useState<Seat | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Disable confirmation dialog states
  const [openDisableDialog, setOpenDisableDialog] = useState(false);
  const [seatsToDisable, setSeatsToDisable] = useState<Seat[]>([]);
  const [disabling, setDisabling] = useState(false);
  const [disableError, setDisableError] = useState<string | null>(null);
  const [disableSuccess, setDisableSuccess] = useState(false);

  // Add these new states for room editing
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editRoomName, setEditRoomName] = useState("");
  const [editRow, setEditRow] = useState(0);
  const [editColumn, setEditColumn] = useState(0);
  const [isUpdatingRoom, setIsUpdatingRoom] = useState(false);
  const [updateRoomError, setUpdateRoomError] = useState<string | null>(null);
  const [updateRoomSuccess, setUpdateRoomSuccess] = useState(false);
  const [movieTheaters, setMovieTheaters] = useState<any[]>([]);
  const [selectedTheaterId, setSelectedTheaterId] = useState<string>("");
  const [isLoadingTheaters, setIsLoadingTheaters] = useState(false);

  // Handle opening delete dialog
  const handleOpenDeleteDialog = (seat: Seat) => {
    setSeatToDelete(seat);
    setOpenDeleteDialog(true);
  };

  // Handle closing delete dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSeatToDelete(null);
    setDeleteError(null);
    setDeleteSuccess(false);
  };

  // Handle actual seat deletion
  const handleDeleteSeat = async () => {
    if (!seatToDelete) return;

    setDeleting(true);
    setDeleteError(null);
    setDeleteSuccess(false);

    try {
      const response = await api.delete(`seat/${seatToDelete.seatId}/single`);

      if (response.data.isSuccess) {
        setDeleteSuccess(true);
        // Don't show toast here as it duplicates the dialog success message
        // Refresh the data after a short delay
        setTimeout(() => {
          handleCloseDeleteDialog();
          // Refresh the room data
          queryClient.invalidateQueries(["roomDetail", roomId]);
          queryClient.invalidateQueries("rooms");
          queryClient.invalidateQueries("PhongChieuData");
        }, 1500);
      } else {
        setDeleteError(response.data.message || "Xóa ghế không thành công");
        toast.error(`Lỗi: ${response.data.message}`);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Đã xảy ra lỗi khi xóa ghế";
      setDeleteError(errorMsg);
      toast.error(`Lỗi: ${errorMsg}`);
    } finally {
      setDeleting(false);
    }
  };

  // Handle opening disable dialog
  const handleOpenDisableDialog = (seats: Seat[]) => {
    setSeatsToDisable(seats);
    setOpenDisableDialog(true);
  };

  // Handle closing disable dialog
  const handleCloseDisableDialog = () => {
    setOpenDisableDialog(false);
    setSeatsToDisable([]);
    setDisableError(null);
    setDisableSuccess(false);
  };

  // Handle actual seat disabling
  const handleDisableSeat = async () => {
    if (seatsToDisable.length === 0) return;

    setDisabling(true);
    setDisableError(null);
    setDisableSuccess(false);

    try {
      const seatIds = seatsToDisable.map(seat => seat.seatId);
      const isActive = !seatsToDisable[0].isActive; // All seats will have the same isActive status
      await updateSeatActiveStatus(seatIds, isActive, false);
      setDisableSuccess(true);
      // Don't show toast here as it duplicates the dialog success message
      // Refresh the data after a short delay
      setTimeout(() => {
        handleCloseDisableDialog();
        // Refresh the room data
        queryClient.invalidateQueries(["roomDetail", roomId]);
      }, 1500);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật trạng thái ghế";
      setDisableError(errorMsg);
      toast.error(`Lỗi: ${errorMsg}`);
    } finally {
      setDisabling(false);
    }
  };

  // Fetch room data
  const fetchRoom = async (id: string) => {
    const response = await api.get(`room/${id}/info`);
    const roomData = response.data.data;
    return roomData;
  };

  // Fetch seat types
  const fetchSeatTypes = async () => {
    const response = await api.get(`seattype`);
    return response.data.data || [];
  };

  // Fetch movie theaters
  const fetchMovieTheaters = async () => {
    const response = await api.get(`movietheater`);
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

  // Query for movie theaters
  const { data: theaters } = useQuery(
    "movieTheaters",
    fetchMovieTheaters,
    {
      onSuccess: (data) => {
        setMovieTheaters(data);
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
      const roomResponse = await api.get(`room/${roomId}/info`);
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
        `seat/type?seatTypeId=${seatTypeId}`, seatIds,
        {
          headers: {
            "Content-Type": "application/json",
            "accept": "text/plain"
          }
        }
      );

      if (response.data.isSuccess)
        setUpdateSuccess(true);
        toast.success(`${mode === "row" ? "Hàng" : "Cột"} ghế đã được cập nhật thành công!`);
        queryClient.invalidateQueries(["roomDetail", roomId]);


      return response.data;
    } catch (error: any) {
      const errorMsg = error.response?.reason || "Đã xảy ra lỗi khi cập nhật ghế";
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
      // Call the API to add a new row
      const response = await api.post(
        `seat/row?roomId=${roomId}&seatTypeId=${seatTypeId}`,
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
        queryClient.invalidateQueries("rooms");
        queryClient.invalidateQueries("PhongChieuData");
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
      // Call the API to add a new column
      const response = await api.post(
        `seat/column?roomId=${roomId}&seatTypeId=${seatTypeId}`,
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
        queryClient.invalidateQueries("rooms");
        queryClient.invalidateQueries("PhongChieuData");
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
  const handleSeatClick = async (seat: any, event: React.MouseEvent) => {
    if (updateLoading) return;

    // Handle right click to delete
    if (event.button === 2) {
      event.preventDefault();
      handleOpenDeleteDialog(seat);
      return;
    }

    // Toggle seat selection for left click
    toggleSeatSelection(seat.seatId);
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
  const updateSeatActiveStatus = async (seatIds: string[], isActive: boolean, showToast: boolean = true) => {
    setUpdateLoading(true);
    setUpdateSuccess(false);
    setUpdateError(null);

    try {
      // Update seats active status using the API
      const response = await api.put(
        `seat/room/status?isActived=${isActive}`, seatIds,
        {
          headers: {
            "Content-Type": "application/json",
            "accept": "text/plain"
          }
        }
      );

      if (response.data.isSuccess) {
        setUpdateSuccess(true);
        // Only show toast if showToast parameter is true
        if (showToast) {
          toast.success(`Đã cập nhật trạng thái kích hoạt của ${seatIds.length} ghế!`);
        }
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

    // Get the selected seats from the room data
    const selectedSeatObjects = room.seats.filter((seat: Seat) =>
      selectedSeats.includes(seat.seatId)
    );

    // Show confirmation dialog
    handleOpenDisableDialog(selectedSeatObjects);
  };

  // Create a single seat at specific position
  const createSeatAtPosition = async (roomId: string, seatTypeId: string, row: string, column: number) => {
    setUpdateLoading(true);
    setUpdateSuccess(false);
    setUpdateError(null);

    try {
      // Create the seat using the API
      const response = await api.post(
        `seat/create`,
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

  // Handle opening edit dialog
  const handleOpenEditDialog = () => {
    setEditRoomName(room.roomName || "");
    setEditRow(room.row || 0);
    setEditColumn(room.column || 0);
    setSelectedTheaterId(room.movieTheaterId || "");
    setOpenEditDialog(true);
    setUpdateRoomError(null);
    setUpdateRoomSuccess(false);
  };

  // Handle closing edit dialog
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  // Update room information
  const updateRoom = async () => {
    if (!roomId || !editRoomName.trim()) {
      toast.error("Tên phòng không được để trống");
      return;
    }

    if (editRow <= 0 || editColumn <= 0) {
      toast.error("Số hàng và cột phải lớn hơn 0");
      return;
    }

    if (!selectedTheaterId) {
      toast.error("Vui lòng chọn rạp chiếu phim");
      return;
    }

    setIsUpdatingRoom(true);
    setUpdateRoomError(null);
    setUpdateRoomSuccess(false);

    try {
      // Create the payload for the API request
      const payload = {
        roomId: roomId,
        roomName: editRoomName,
        row: hasSeats ? room.row : editRow,
        column: hasSeats ? room.column : editColumn,
        total: room.total,
        movieTheaterId: selectedTheaterId
      };

      console.log("Updating room with payload:", payload);

      const response = await api.put(`room/${roomId}`, payload);

      if (response.data.isSuccess) {
        setUpdateRoomSuccess(true);
        toast.success("Cập nhật thông tin phòng thành công!");

        // Update the local room data for immediate UI update
        if (room) {
          // Create a shallow copy with updated values
          const updatedRoom = {
            ...room,
            roomName: editRoomName,
            row: hasSeats ? room.row : editRow,
            column: hasSeats ? room.column : editColumn,
            movieTheaterId: selectedTheaterId
          };

          // Use the queryClient to update the cached data
          queryClient.setQueryData(["roomDetail", roomId], updatedRoom);
        }

        // Refresh the room data from server
        queryClient.invalidateQueries(["roomDetail", roomId]);
        queryClient.invalidateQueries("rooms");
        queryClient.invalidateQueries("PhongChieuData");

        // Close the dialog after a short delay
        setTimeout(() => {
          handleCloseEditDialog();
        }, 1500);
      } else {
        setUpdateRoomError(response.data.message || "Cập nhật không thành công");
        toast.error(`Lỗi: ${response.data.message}`);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật thông tin phòng";
      setUpdateRoomError(errorMsg);
      toast.error(`Lỗi: ${errorMsg}`);
    } finally {
      setIsUpdatingRoom(false);
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
            {t("admin.room_management.room_id_not_found")}
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
            {t("admin.room_management.room_infor_not_found")}
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
          onClick={() => navigate("/admin/ql-phong-chieu", { state: { refresh: true } })}
          sx={{ mb: 2 }}
        >
          {t("admin.room_management.come_back_list_room")}
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: 'primary.main',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <TheaterIcon sx={{ mr: 2, fontSize: 32 }} />
            <Box>
              <Typography variant="h5" component="h1" fontWeight="bold">
                {room.roomName}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {`${room.row} hàng × ${room.column} cột (${room.total} ghế)`}
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            color="secondary"
            onClick={handleOpenEditDialog}
            startIcon={<EditIcon />}
            sx={{
              boxShadow: 2,
              '&:hover': { boxShadow: 4 }
            }}
          >
            Sửa tên phòng
          </Button>
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
                        {t("admin.room_management.row_number")}
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
                        {t("admin.room_management.column_number")}
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
                          {t("admin.room_management.seat_total")}
                        </Typography>
                        <Typography variant="h4" fontWeight="medium" color="primary">
                          {room.total}
                        </Typography>
                      </Box>
                      <ChairIcon sx={{ fontSize: 48, color: theme.palette.primary.light, opacity: 0.7 }} />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={<EventSeatIcon />}
                      onClick={() => navigate('/admin/ql-thoi-gian-chieu/them-thoi-gian-chieu', { state: { roomId: roomId } })}
                      sx={{ mt: 2 }}
                    >
                      Tạo lịch chiếu cho phòng này
                    </Button>
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
                title={t("admin.room_management.update_seattype")}
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
                      {t("admin.room_management.not_found_seat")}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 300 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/admin/ql-phong-chieu")}
                        startIcon={<AddIcon />}
                      >
                        {t("admin.room_management.back_to_list_seat_created")}
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
                        label={t("admin.room_management.row_select")}
                        icon={<Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ChairIcon sx={{ mr: 0.5, fontSize: 18 }} />
                          <ChairIcon sx={{ mr: 0.5, fontSize: 18 }} />
                          <ChairIcon sx={{ fontSize: 18 }} />
                        </Box>}
                        iconPosition="start"
                      />
                      <Tab
                        value="column"
                        label={t("admin.room_management.column_select")}
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
                        <InputLabel>{t("admin.room_management.seattype")}</InputLabel>
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
                            {t("admin.room_management.selected")} <strong>{getSelectedSeatTypeName()}</strong>
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
                      {selectionMode === "row" ? t("admin.room_management.select_update_row") : t("admin.room_management.select_update_column")}
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
                              {t("admin.room_management.select_update_row")}
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
                              {t("admin.room_management.add_new_column")}
                            </Button>
                          </span>
                        </Tooltip>
                      </Grid>
                    </Grid>

                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleUpdateSeats}
                      sx={{
                        py: 1.2,
                        borderRadius: 2,
                        fontWeight: 'bold',
                        boxShadow: 2,
                        // Initially display with blue background regardless of hover state
                        backgroundColor: selectedSeatTypeId ? '#4caf50' : '#2196f3', // Green when seat type selected, blue by default
                        color: 'white', // Always white text for good contrast
                        textShadow: '0 1px 1px rgba(0,0,0,0.2)',
                        letterSpacing: '0.5px',
                        transition: 'background-color 0.3s ease',
                        '&:hover': {
                          backgroundColor: selectedSeatTypeId ? '#388e3c' : '#1976d2', // Darker shades on hover
                        }
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
                  {t("seat_cinema.screening")}
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
                    {t("admin.room_management.not_found_seat")}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center', maxWidth: 500 }}>
                    {t("admin.room_management.tutorial_create_seat")}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/admin/ql-phong-chieu")}
                    startIcon={<ArrowBackIcon />}
                  >
                    {t("admin.room_management.come_back_list_room")}
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
                                ? `${seatLabel} - ${seat.status === SeatStatus.Available ? t("admin.room_management.existed") :
                                  seat.status === SeatStatus.Unavailable ? t("admin.room_management.not_available") :
                                    seat.status === SeatStatus.Sold ? t("admin.room_management.sold") :
                                      seat.status === SeatStatus.Reserved ? t("admin.room_management.booking") : t("admin.room_management.unknow")
                                }${isInactive ? " - " + t("admin.room_management.disabled") : " - " + t("admin.room_management.actived")}${isSelected ? " - " + t("admin.room_management.selected") : ""}`
                                : `${seatLabel} - ${t("admin.room_management.vacant_position")}`
                              }
                            >
                              {seat ? (
                                <Box
                                  onClick={(event) =>
                                    event.ctrlKey || event.metaKey
                                      ? toggleSeatSelection(seat.seatId)
                                      : handleSeatClick(seat, event)
                                  }
                                  onContextMenu={(event) => {
                                    event.preventDefault();
                                    handleOpenDeleteDialog(seat);
                                  }}
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
                      {t("admin.room_management.click_to_select")}
                    </Typography>
                  </Box>

                  {/* Floating action buttons when seats are selected */}
                  {selectedSeats.length > 0 && (
                    <Paper
                      elevation={3}
                      sx={{
                        position: 'sticky',
                        bottom: 20,
                        left: 0,
                        right: 0,
                        zIndex: 10,
                        p: 2,
                        mt: 3,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.background.paper, 0.9),
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EventSeatIcon sx={{ color: '#9c27b0', mr: 1 }} />
                        <Typography variant="body1" fontWeight="medium">
                          {t("admin.room_management.selected")} {selectedSeats.length}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => setSelectedSeats([])}
                        >
                          {t("admin.room_management.cancel")}
                        </Button>
                        <FormControl variant="outlined" size="small" sx={{ minWidth: 120, mx: 2 }}>
                          <InputLabel id="active-status-select-label">Trạng thái</InputLabel>
                          <Select
                            labelId="active-status-select-label"
                            id="active-status-select"
                            value={isActiveStatus ? 'true' : 'false'}
                            onChange={handleIsActiveChange}
                            label={t("admin.room_management.status")}
                          >
                            <MenuItem value="true">Kích hoạt</MenuItem>
                            <MenuItem value="false">Vô hiệu hóa</MenuItem>
                          </Select>
                        </FormControl>
                        <Button
                          variant="contained"
                          color="warning"
                          onClick={handleUpdateSeatsActiveStatus}
                          startIcon={<EventSeatIcon />}
                        >
                          {t("admin.room_management.update_seat")}
                        </Button>
                      </Box>
                    </Paper>
                  )}
                </>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ bgcolor: 'error.main', color: 'white', pb: 2 }}>
          <DeleteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {t("admin.room_management.delete_seat")}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            {t("admin.room_management.surely_delete")} {seatToDelete?.atRow}{seatToDelete?.atColumn}?
            {t("admin.room_management.cannot_return")}
          </Typography>

          <Box sx={{
            p: 2,
            bgcolor: '#fff8e1',
            borderRadius: 1,
            border: '1px solid #ffe57f',
            mb: 2
          }}>
            <Typography variant="body2" color="warning.dark">
              <strong>{t("admin.room_management.warming")}</strong> {t("admin.room_management.warming_delete")}
            </Typography>
          </Box>

          {deleteSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {t("admin.room_management.delete_success")}
            </Alert>
          )}

          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            disabled={deleting}
            variant="outlined"
          >
            {t("admin.room_management.cancel")}
          </Button>
          <Button
            onClick={handleDeleteSeat}
            variant="contained"
            color="error"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
          >
            {deleting ? t("admin.room_management.delete_loading") : t("admin.room_management.delete_confirm")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Disable Confirmation Dialog */}
      <Dialog
        open={openDisableDialog}
        onClose={handleCloseDisableDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ bgcolor: 'warning.main', color: 'white', pb: 2 }}>
          <EventSeatIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {seatsToDisable[0]?.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'} ghế
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            {t("admin.room_management.you_sure")} {seatsToDisable[0]?.isActive ? t("admin.room_management.disable") : t("admin.room_management.active")} {seatsToDisable.length} ghế đã chọn?
          </Typography>

          <Box sx={{
            p: 2,
            bgcolor: '#fff8e1',
            borderRadius: 1,
            border: '1px solid #ffe57f',
            mb: 2
          }}>
            <Typography variant="body2" color="warning.dark">
              <strong>Lưu ý:</strong> {seatsToDisable[0]?.isActive
                ? t("admin.room_management.warming_disable")
                : t("admin.room_management.warming_active")}
            </Typography>
          </Box>

          {disableSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {seatsToDisable[0]?.isActive ? t("admin.room_management.disabled") : t("admin.room_management.actived")} {seatsToDisable.length} ghế thành công!
            </Alert>
          )}

          {disableError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {disableError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseDisableDialog}
            disabled={disabling}
            variant="outlined"
          >
            {t("admin.room_management.cancel")}
          </Button>
          <Button
            onClick={handleDisableSeat}
            variant="contained"
            color="warning"
            disabled={disabling}
            startIcon={disabling ? <CircularProgress size={20} color="inherit" /> : <EventSeatIcon />}
          >
            {disabling ? t("auth.login.processing") : seatsToDisable[0]?.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Room Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', pb: 2 }}>
          <EditIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {t("admin.room_management.room_edit")}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Cập nhật tên phòng chiếu
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="roomName"
            label="Tên phòng"
            type="text"
            fullWidth
            variant="outlined"
            value={editRoomName}
            onChange={(e) => setEditRoomName(e.target.value)}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel id="movie-theater-label">Rạp chiếu phim</InputLabel>
            <Select
              labelId="movie-theater-label"
              id="movie-theater-select"
              value={selectedTheaterId}
              onChange={(e) => setSelectedTheaterId(e.target.value)}
              label="Rạp chiếu phim"
            >
              {movieTheaters.map((theater) => (
                <MenuItem key={theater.movieTheaterId} value={theater.movieTheaterId}>
                  {theater.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {!hasSeats ? (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Cấu hình kích thước phòng
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                Bạn có thể thay đổi số hàng và cột vì phòng chưa có ghế
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    id="roomRow"
                    label="Số hàng"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={editRow}
                    onChange={(e) => setEditRow(parseInt(e.target.value))}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="roomColumn"
                    label="Số cột"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={editColumn}
                    onChange={(e) => setEditColumn(parseInt(e.target.value))}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box sx={{
              mt: 2,
              mb: 2,
              p: 2,
              bgcolor: alpha('#f5f5f5', 0.7),
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider'
            }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                <InfoIcon sx={{ fontSize: 18, mr: 0.5, color: 'info.main' }} />
                Kích thước phòng hiện tại: {room.row} hàng × {room.column} cột
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Không thể thay đổi kích thước vì phòng đã có ghế. Xóa tất cả ghế trước khi thay đổi.
              </Typography>
            </Box>
          )}

          {updateRoomSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {t("admin.room_management.success_room_update")}
            </Alert>
          )}

          {updateRoomError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {updateRoomError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseEditDialog}
            disabled={isUpdatingRoom}
            variant="outlined"
          >
            {t("admin.room_management.cancel")}
          </Button>
          <Button
            onClick={updateRoom}
            variant="contained"
            color="primary"
            disabled={isUpdatingRoom || !editRoomName.trim()}
            startIcon={isUpdatingRoom ? <CircularProgress size={20} color="inherit" /> : <CheckCircleOutlineIcon />}
          >
            {isUpdatingRoom ? t("admin.room_management.update_process") : t("admin.room_management.update")}
          </Button>
        </DialogActions>
      </Dialog>
    </ManagementPageLayout>
  );
};

export default ChiTietPhongChieu;
