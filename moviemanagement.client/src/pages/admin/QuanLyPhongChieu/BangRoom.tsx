import {
  Typography,
  Grid,
  Card,
  Box,
  IconButton,
  Divider,
  Paper,
  Container,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Room as RoomType } from "../../../types/room.types";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import EditIcon from "@mui/icons-material/Edit";
import TheaterComedyIcon from "@mui/icons-material/TheaterComedy";
import ChairIcon from '@mui/icons-material/Chair';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
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
}

const RoomTable: React.FC<RoomTableProps> = ({ rooms, onEdit }) => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [selectedSeatTypeId, setSelectedSeatTypeId] = useState("");
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Function to navigate to create room page
  const handleCreateRoomClick = () => {
    navigate('/admin/ql-phong-chieu/them-phong-chieu');
  };

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
          // Refresh the page to show updated data
          window.location.reload();
        }, 2000);
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
          // Refresh the page to show updated data
          window.location.reload();
        }, 2000);
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

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TheaterComedyIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" fontWeight="bold">
            Danh sách phòng chiếu
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleCreateRoomClick}
        >
          Tạo phòng chiếu mới
        </Button>
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
                      ghế
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
                      Xem chi tiết
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
                        Tạo ghế
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
                          Tạo thêm ghế
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
                          Xóa tất cả ghế
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
            "Tạo ghế cho phòng" :
            "Tạo thêm ghế cho phòng"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            {rooms.find(r => r.roomId === selectedRoomId)?.total === 0 ?
              "Chọn loại ghế để tạo cho phòng chiếu. Tất cả ghế trong phòng sẽ được tạo với loại ghế này." :
              "Tạo thêm ghế cho phòng chiếu hiện có. Ghế mới sẽ được thêm vào với loại ghế được chọn."}
          </Typography>

          <FormControl fullWidth sx={{ mt: 1, mb: 2 }}>
            <InputLabel>Loại ghế</InputLabel>
            <Select
              value={selectedSeatTypeId}
              onChange={handleSeatTypeChange}
              label="Loại ghế"
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
                Đã chọn: <strong>{getSelectedSeatTypeName()}</strong>
              </Typography>
              <Typography variant="body2" color="primary" fontWeight="medium">
                {getSelectedSeatTypePrice().toLocaleString('vi-VN')}đ
              </Typography>
            </Box>
          )}

          {createSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Tạo ghế thành công!
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
            Hủy
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
          Xóa tất cả ghế
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Bạn có chắc chắn muốn xóa tất cả ghế trong phòng này? Hành động này không thể hoàn tác.
          </Typography>

          <Box sx={{
            p: 2,
            bgcolor: '#fff8e1',
            borderRadius: 1,
            border: '1px solid #ffe57f',
            mb: 2
          }}>
            <Typography variant="body2" color="warning.dark">
              <strong>Lưu ý:</strong> Việc xóa tất cả ghế sẽ ảnh hưởng đến các lịch chiếu nếu có. Hãy chắc chắn rằng phòng này không còn được sử dụng cho bất kỳ lịch chiếu nào.
            </Typography>
          </Box>

          {deleteSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Xóa ghế thành công!
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
    </Container>
  );
};

export default RoomTable;
