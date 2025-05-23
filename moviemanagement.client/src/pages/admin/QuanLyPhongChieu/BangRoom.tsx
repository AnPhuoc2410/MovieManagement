import AddIcon from '@mui/icons-material/Add';
import ChairIcon from '@mui/icons-material/Chair';
import DeleteIcon from '@mui/icons-material/Delete';
import EventSeatIcon from "@mui/icons-material/EventSeat";
import TheaterComedyIcon from "@mui/icons-material/TheaterComedy";
import TheatersIcon from '@mui/icons-material/Theaters';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from "@mui/material";
import { t } from "i18next";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../apis/axios.config";

export interface Room {
  roomId: string;
  roomName: string;
  total: number;
}

interface SeatType {
  seatTypeId: string;
  typeName: string;
  price: number;
}

interface RoomTableProps {
  rooms: Room[];
  onEdit: (id: string) => void;
  rowHeight?: number;
  onRefreshData?: () => void;
}

const RoomTable: React.FC<RoomTableProps> = ({ rooms, onEdit, onRefreshData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openTheaterDialog, setOpenTheaterDialog] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [selectedSeatTypeId, setSelectedSeatTypeId] = useState("");
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [creatingTheater, setCreatingTheater] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [createTheaterSuccess, setCreateTheaterSuccess] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [createTheaterError, setCreateTheaterError] = useState<string | null>(null);
  const [theaterName, setTheaterName] = useState("");
  const [theaterLocation, setTheaterLocation] = useState("HCM");
  const [theaterAddress, setTheaterAddress] = useState("");
  const [theaterImage, setTheaterImage] = useState("");
  const [openSeatTypeDialog, setOpenSeatTypeDialog] = useState<boolean>(false);
  const [creatingSeatType, setCreatingSeatType] = useState<boolean>(false);
  const [createSeatTypeSuccess, setCreateSeatTypeSuccess] = useState<boolean>(false);
  const [createSeatTypeError, setCreateSeatTypeError] = useState<string | null>(null);
  const [newSeatTypeName, setNewSeatTypeName] = useState<string>("");
  const [newSeatTypePrice, setNewSeatTypePrice] = useState<string>("");

  // Function to navigate to create room page
  const handleCreateRoomClick = () => {
    navigate('/admin/ql-phong-chieu/them-phong-chieu');
  };

  // Check if we returned from creating a new room
  useEffect(() => {
    // Check location state for indications that we need to refresh
    if (location.state && location.state.refresh) {
      // Invalidate and refetch the rooms data
      queryClient.invalidateQueries('rooms');

      // Call parent component's refresh function if available
      if (onRefreshData) {
        onRefreshData();
      }

      // Clear the state to prevent repeated refreshes
      navigate(location.pathname, { replace: true });
    }
  }, [location, queryClient, navigate, onRefreshData]);

  // Fetch seat types
  const fetchSeatTypes = async () => {
    const response = await api.get(`seattype`);
    return response.data.data || [];
  };

  // Query for seat types
  const { data: seatTypes, isLoading: isLoadingSeatTypes } = useQuery<SeatType[]>(
    "seatTypes",
    fetchSeatTypes
  );

  // Effect to set the first seat type as default when loaded
  useEffect(() => {
    if (seatTypes && seatTypes.length > 0 && !selectedSeatTypeId) {
      setSelectedSeatTypeId(seatTypes[0].seatTypeId);
    }
  }, [seatTypes, selectedSeatTypeId]);

  const handleEditClick = (roomId: string) => {
    console.log("Handling click for roomId:", roomId);
    console.log("Available rooms:", rooms);

    if (roomId) {
      navigate(`/admin/ql-phong-chieu/${roomId}`);
    } else {
      console.error("No roomId provided");
    }
  };

  const handleCreateSeatsClick = (roomId: string) => {
    setSelectedRoomId(roomId);
    setOpenDialog(true);
  };

  const handleSeatTypeChange = (event: SelectChangeEvent) => {
    setSelectedSeatTypeId(event.target.value);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCreateSuccess(false);
    setCreateError(null);
  };

  const handleCreateSeats = async () => {
    if (!selectedRoomId || !selectedSeatTypeId) {
      toast.error("Vui lòng chọn loại ghế");
      return;
    }

    setCreating(true);
    setCreateSuccess(false);
    setCreateError(null);

    try {
      // Call the API to create seat for the room
      const response = await api.post(
        `seat/room/${selectedRoomId}?seatTypeId=${selectedSeatTypeId}`,
        {
          headers: {
            "accept": "text/plain"
          }
        }
      );

      if (response.data.isSuccess) {
        setCreateSuccess(true);
        toast.success("Đã tạo ghế thành công!");
        // Refresh the data after a short delay
        setTimeout(() => {
          handleCloseDialog();
          // Invalidate and refetch the rooms data
          queryClient.invalidateQueries('rooms');
          // Also invalidate the specific room data
          queryClient.invalidateQueries(['roomDetail', selectedRoomId]);
          // Call parent component's refresh function if available
          if (onRefreshData) {
            onRefreshData();
          }
        }, 1500);
      } else {
        setCreateError(response.data.message || "Tạo ghế không thành công");
        toast.error(`Lỗi: ${response.data.message}`);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Đã xảy ra lỗi khi tạo ghế";
      setCreateError(errorMsg);
      toast.error(`Lỗi: ${errorMsg}`);
    } finally {
      setCreating(false);
    }
  };

  // Function to get the selected seat type name
  const getSelectedSeatTypeName = (): string => {
    if (!seatTypes || !selectedSeatTypeId) return '';
    const seatType = seatTypes?.find(type => type.seatTypeId === selectedSeatTypeId);
    return seatType ? seatType.typeName : '';
  };

  // Get seat type price
  const getSelectedSeatTypePrice = (): number => {
    if (!seatTypes || !selectedSeatTypeId) return 0;
    const seatType = seatTypes?.find(type => type.seatTypeId === selectedSeatTypeId);
    return seatType ? seatType.price : 0;
  };

  const handleDeleteSeatsClick = (roomId: string) => {
    setSelectedRoomId(roomId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeleteSuccess(false);
    setDeleteError(null);
  };

  const handleDeleteSeats = async () => {
    if (!selectedRoomId) {
      toast.error("Không tìm thấy mã phòng");
      return;
    }

    setDeleting(true);
    setDeleteSuccess(false);
    setDeleteError(null);

    try {
      // Call the API to delete all seats for the room
      const response = await api.delete(
        `seat/room/${selectedRoomId}`,
        {
          headers: {
            "accept": "text/plain"
          }
        }
      );

      if (response.data.isSuccess) {
        setDeleteSuccess(true);
        toast.success("Đã xóa tất cả ghế thành công!");
        // Refresh the data after a short delay
        setTimeout(() => {
          handleCloseDeleteDialog();
          // Invalidate and refetch the rooms data
          queryClient.invalidateQueries('rooms');
          // Also invalidate the specific room data
          queryClient.invalidateQueries(['roomDetail', selectedRoomId]);
          // Call parent component's refresh function if available
          if (onRefreshData) {
            onRefreshData();
          }
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

  const handleCreateTheaterClick = () => {
    setOpenTheaterDialog(true);
  };

  const handleCloseTheaterDialog = () => {
    setOpenTheaterDialog(false);
    setCreateTheaterSuccess(false);
    setCreateTheaterError(null);
    // Reset theater form
    setTheaterName("");
    setTheaterLocation("HCM");
    setTheaterAddress("");
    setTheaterImage("");
  };

  const handleLocationChange = (event: SelectChangeEvent) => {
    setTheaterLocation(event.target.value);
  };

  const handleCreateTheater = async () => {
    if (!theaterName || !theaterLocation || !theaterAddress) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setCreatingTheater(true);
    setCreateTheaterSuccess(false);
    setCreateTheaterError(null);

    try {
      // Call the API to create movie theater
      const response = await api.post(
        `movietheater`,
        {
          name: theaterName,
          location: theaterLocation,
          address: theaterAddress,
          image: theaterImage,
          isDeleted: false
        },
        {
          headers: {
            "accept": "text/plain",
            "Content-Type": "application/json-patch+json"
          }
        }
      );

      if (response.data.isSuccess) {
        setCreateTheaterSuccess(true);
        toast.success("Đã tạo rạp chiếu phim thành công!");
        // Refresh the data after a short delay
        setTimeout(() => {
          handleCloseTheaterDialog();
          // Invalidate and refetch any related data
          queryClient.invalidateQueries('theaters');
          queryClient.invalidateQueries('movieTheaters');
          // Also refresh the rooms data since they depend on theaters
          queryClient.invalidateQueries('rooms');
          // Call parent component's refresh function
          if (onRefreshData) {
            onRefreshData();
          }
        }, 1500);
      } else {
        setCreateTheaterError(response.data.message || "Tạo rạp chiếu phim không thành công");
        toast.error(`Lỗi: ${response.data.message}`);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Đã xảy ra lỗi khi tạo rạp chiếu phim";
      setCreateTheaterError(errorMsg);
      toast.error(`Lỗi: ${errorMsg}`);
    } finally {
      setCreatingTheater(false);
    }
  };

  const handleOpenSeatTypeDialog = () => {
    setOpenSeatTypeDialog(true);
    setCreateSeatTypeSuccess(false);
    setCreateSeatTypeError(null);
    setNewSeatTypeName("");
    setNewSeatTypePrice("");
  };

  const handleCloseSeatTypeDialog = () => {
    setOpenSeatTypeDialog(false);
  };

  const handleCreateSeatType = async () => {
    if (!newSeatTypeName || !newSeatTypePrice) {
      toast.error("Vui lòng điền đầy đủ thông tin loại ghế");
      return;
    }

    const price = parseFloat(newSeatTypePrice);
    if (isNaN(price) || price <= 0) {
      toast.error("Giá ghế phải là số dương");
      return;
    }

    setCreatingSeatType(true);
    setCreateSeatTypeSuccess(false);
    setCreateSeatTypeError(null);

    try {
      // Call the API to create a new seat type
      const response = await api.post(
        "seattype",
        {
          typeName: newSeatTypeName,
          price: price
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        }
      );

      if (response.data && response.data.isSuccess) {
        setCreateSeatTypeSuccess(true);
        toast.success("Đã tạo loại ghế mới thành công!");
        // Reset form and refresh data
        setNewSeatTypeName("");
        setNewSeatTypePrice("");

        // Refresh the seat types data after a short delay
        setTimeout(() => {
          queryClient.invalidateQueries("seatTypes");
          setOpenSeatTypeDialog(false);
        }, 1500);
      } else {
        const errorMsg = response.data?.message || "Không thể tạo loại ghế mới";
        setCreateSeatTypeError(errorMsg);
        toast.error(`Lỗi: ${errorMsg}`);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Đã xảy ra lỗi khi tạo loại ghế mới";
      setCreateSeatTypeError(errorMsg);
      toast.error(`Lỗi: ${errorMsg}`);
    } finally {
      setCreatingSeatType(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TheaterComedyIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" fontWeight="bold">
            {t("admin.room_management.room_list")}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="info"
            startIcon={<EventSeatIcon />}
            onClick={handleOpenSeatTypeDialog}
          >
            {t("admin.room_management.create_seattype")}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<TheatersIcon />}
            onClick={handleCreateTheaterClick}
          >
            {t("admin.room_management.create_theater")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateRoomClick}
          >
            {t("admin.room_management.create_room")}
          </Button>
        </Box>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 2, bgcolor: '#f8f9fa', p: 3 }}>
        <Grid container spacing={3}>
          {rooms.map((room) => (
            <Grid item xs={12} sm={6} md={4} key={room.roomId}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.15)'
                  },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Box
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    py: 2,
                    px: 2.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ChairIcon sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">{room.roomName}</Typography>
                  </Box>
                </Box>

                <Box sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexGrow: 1
                }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}>
                    <EventSeatIcon sx={{ color: 'primary.main', fontSize: 50, mr: 1.5 }} />
                    <Typography variant="h3" fontWeight="medium">
                      {room.total}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ ml: 1, alignSelf: 'flex-end', mb: 1 }}>
                      {t("admin.room_management.seat")}
                    </Typography>
                  </Box>

                  <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      onClick={() => handleEditClick(room.roomId)}
                      sx={{
                        borderRadius: 2,
                        py: 1
                      }}
                    >
                      {t("admin.room_management.detail")}
                    </Button>

                    {room.total === 0 ? (
                      <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={() => handleCreateSeatsClick(room.roomId)}
                        sx={{
                          borderRadius: 2,
                          py: 1
                        }}
                        startIcon={<AddIcon />}
                      >
                        {t("admin.room_management.create_seat")}
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outlined"
                          color="secondary"
                          fullWidth
                          onClick={() => handleCreateSeatsClick(room.roomId)}
                          sx={{
                            borderRadius: 2,
                            py: 1
                          }}
                          startIcon={<AddIcon />}
                        >
                          {t("admin.room_management.add_seat")}
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          fullWidth
                          onClick={() => handleDeleteSeatsClick(room.roomId)}
                          sx={{
                            borderRadius: 2,
                            py: 1
                          }}
                          startIcon={<DeleteIcon />}
                        >
                          {t("admin.room_management.delete_all_seat")}
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Dialog for creating seats */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', pb: 2 }}>
          <EventSeatIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {rooms.find(r => r.roomId === selectedRoomId)?.total === 0 ?
            t("admin.room_management.create_seat_for_room") :
            t("admin.room_management.add_seat_for_room")}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            {rooms.find(r => r.roomId === selectedRoomId)?.total === 0 ?
              t("admin.room_management.select_seattype_created") :
              t("admin.room_management.select_seattype_add")}
          </Typography>

          <FormControl fullWidth sx={{ mt: 1, mb: 2 }}>
            <InputLabel>{t("admin.room_management.seattype")}</InputLabel>
            <Select
              value={selectedSeatTypeId}
              onChange={handleSeatTypeChange}
              label={t("admin.room_management.seattype")}
              disabled={isLoadingSeatTypes || creating}
            >
              {seatTypes?.map((type) => (
                <MenuItem
                  key={type.seatTypeId}
                  value={type.seatTypeId}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <EventSeatIcon color="action" fontSize="small" />
                  <span>{type.typeName}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: '#666' }}>
                    {type.price.toLocaleString('vi-VN')}đ
                  </span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {getSelectedSeatTypeName() && (
            <Box sx={{
              p: 2,
              bgcolor: '#f5f5f5',
              borderRadius: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}>
              <Typography variant="body2">
                {t("admin.room_management.selected")} <strong>{getSelectedSeatTypeName()}</strong>
              </Typography>
              <Typography variant="body2" color="primary" fontWeight="medium">
                {getSelectedSeatTypePrice().toLocaleString('vi-VN')}đ
              </Typography>
            </Box>
          )}

          {createSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {t("admin.room_management.created_success")}
            </Alert>
          )}

          {createError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {createError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseDialog}
            disabled={creating}
            variant="outlined"
          >
            {t("admin.room_management.cancel")}
          </Button>
          <Button
            onClick={handleCreateSeats}
            variant="contained"
            disabled={creating || !selectedSeatTypeId}
            startIcon={creating ? <CircularProgress size={20} /> : <AddIcon />}
          >
            {creating ? 'Đang tạo...' : 'Tạo ghế'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for deleting seats */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ bgcolor: 'error.main', color: 'white', pb: 2 }}>
          <DeleteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {t("admin.room_management.delete_all_seat")}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            {t("admin.room_management.confirm_delete")}
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
            Hủy
          </Button>
          <Button
            onClick={handleDeleteSeats}
            variant="contained"
            color="error"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
          >
            {deleting ? 'Đang xóa...' : 'Xác nhận xóa'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for creating movie theater */}
      <Dialog
        open={openTheaterDialog}
        onClose={handleCloseTheaterDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ bgcolor: 'secondary.main', color: 'white', pb: 2 }}>
          <TheatersIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Tạo rạp chiếu phim mới
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            Vui lòng nhập thông tin cho rạp chiếu phim mới
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Tên rạp chiếu phim"
              value={theaterName}
              onChange={(e) => setTheaterName(e.target.value)}
              required
            />

            <FormControl fullWidth required>
              <InputLabel>Địa điểm</InputLabel>
              <Select
                value={theaterLocation}
                onChange={handleLocationChange}
                label="Địa điểm"
              >
                <MenuItem value="HCM">{t("showtime_cinema.location.HCM")}</MenuItem>
                <MenuItem value="BD">{t("showtime_cinema.location.BinhDuong")}</MenuItem>
                <MenuItem value="BP">{t("showtime_cinema.location.BinhPhuoc")}</MenuItem>
                <MenuItem value="DN">{t("showtime_cinema.location.HaNoi")}</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Địa chỉ chi tiết"
              value={theaterAddress}
              onChange={(e) => setTheaterAddress(e.target.value)}
              required
              multiline
              rows={2}
            />
          </Box>

          {createTheaterSuccess && (
            <Alert severity="success" sx={{ mt: 2, mb: 1 }}>
              Tạo rạp chiếu phim thành công!
            </Alert>
          )}

          {createTheaterError && (
            <Alert severity="error" sx={{ mt: 2, mb: 1 }}>
              {createTheaterError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseTheaterDialog}
            disabled={creatingTheater}
            variant="outlined"
          >
            Hủy
          </Button>
          <Button
            onClick={handleCreateTheater}
            variant="contained"
            color="secondary"
            disabled={creatingTheater || !theaterName || !theaterLocation || !theaterAddress}
            startIcon={creatingTheater ? <CircularProgress size={20} /> : <TheatersIcon />}
          >
            {creatingTheater ? 'Đang tạo...' : 'Tạo rạp chiếu phim'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for creating seat type */}
      <Dialog
        open={openSeatTypeDialog}
        onClose={handleCloseSeatTypeDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ bgcolor: 'info.main', color: 'white', pb: 2 }}>
          <EventSeatIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Tạo loại ghế mới
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            Vui lòng nhập thông tin cho loại ghế mới
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Tên loại ghế"
              value={newSeatTypeName}
              onChange={(e) => setNewSeatTypeName(e.target.value)}
              required
              placeholder="VD: Ghế VIP, Ghế đôi, Ghế thường..."
            />

            <TextField
              fullWidth
              label="Giá ghế"
              type="number"
              value={newSeatTypePrice}
              onChange={(e) => setNewSeatTypePrice(e.target.value)}
              required
              placeholder="VD: 100000"
              InputProps={{
                endAdornment: <InputAdornment position="end">VND</InputAdornment>,
              }}
            />
          </Box>

          {createSeatTypeSuccess && (
            <Alert severity="success" sx={{ mt: 2, mb: 1 }}>
              Tạo loại ghế mới thành công!
            </Alert>
          )}

          {createSeatTypeError && (
            <Alert severity="error" sx={{ mt: 2, mb: 1 }}>
              {createSeatTypeError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseSeatTypeDialog}
            disabled={creatingSeatType}
            variant="outlined"
          >
            Hủy
          </Button>
          <Button
            onClick={handleCreateSeatType}
            variant="contained"
            color="info"
            disabled={creatingSeatType || !newSeatTypeName || !newSeatTypePrice}
            startIcon={creatingSeatType ? <CircularProgress size={20} /> : <EventSeatIcon />}
          >
            {creatingSeatType ? 'Đang tạo...' : 'Tạo loại ghế'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RoomTable;
