import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { ShowTime } from '../../../types/showtime.types';
import Loader from '../../../components/shared/Loading/LoadingScreen';
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  CssBaseline,
  Stack,
  alpha,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MovieIcon from '@mui/icons-material/Movie';
import TheatersIcon from '@mui/icons-material/Theaters';
import EventIcon from '@mui/icons-material/Event';
import AppNavbar from '../../../components/mui/AppNavbar';
import Header from '../../../components/mui/Header';
import SideMenu from '../../../components/mui/SideMenu';
import AppTheme from '../../../shared-theme/AppTheme';
import { useState, useEffect } from 'react';
import AdminNowShowingMovies from '../../../components/admin/AdminNowShowingMovies';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import api from '../../../apis/axios.config';

const ChiTietThoiGianChieu = ({ disableCustomTheme = false }: { disableCustomTheme?: boolean }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedMovieId, setSelectedMovieId] = useState<string>('');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [isModified, setIsModified] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [openMovieDialog, setOpenMovieDialog] = useState<boolean>(false);
  const [selectedMovieName, setSelectedMovieName] = useState<string>('');

  // Format datetime string for datetime-local input
  const formatDateTimeForInput = (dateTimeString: string | undefined): string => {
    if (!dateTimeString) return '';
    try {
      const date = new Date(dateTimeString);
      return format(date, "yyyy-MM-dd'T'HH:mm");
    } catch (error) {
      console.error("Error formatting date:", error);
      return '';
    }
  };

  // Fetch showtime details
  const { data: showtime, isLoading: isLoadingShowtime, error: showtimeError } = useQuery<any, Error>(
    ['showtime', id],
    async () => {
      try {
        const response = await api.get(`showtime/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching showtime:', error);
        throw error;
      }
    }
  );

  // Update local state when showtime data is loaded
  useEffect(() => {
    if (showtime) {
      console.log("Setting movie and room IDs from showtime:", showtime);
      // Check if the data property exists and use it if available
      const data = showtime.data || showtime;
      setSelectedMovieId(data.movieId || '');
      setSelectedRoomId(data.roomId || '');

      // Set datetime values for the inputs
      if (data.startTime) {
        setStartTime(formatDateTimeForInput(data.startTime));
      }
      if (data.endTime) {
        setEndTime(formatDateTimeForInput(data.endTime));
      }
    }
  }, [showtime]);

  // Fetch movies list
  const { data: movies, isLoading: isLoadingMovies } = useQuery(
    'movies',
    async () => {
      const response = await api.get('movie');
      console.log('Movies API Response:', response.data);
      // Handle both cases - direct array or nested data property
      return Array.isArray(response.data) ? response.data : response.data?.data || [];
    }
  );

  // Fetch rooms list
  const { data: rooms, isLoading: isLoadingRooms } = useQuery(
    'rooms',
    async () => {
      const response = await api.get('room');
      console.log('Rooms API Response:', response.data);

      // Handle both cases - direct array or nested data property
      return Array.isArray(response.data) ? response.data : response.data?.data || [];
    }
  );

  // Handle movie selection from the dialog
  const handleMovieSelect = (movieId: string) => {
    setSelectedMovieId(movieId);
    setIsModified(true);

    // Find the movie name to display
    if (movies) {
      const movie = movies.find((m: any) => m.movieId === movieId);
      if (movie) {
        setSelectedMovieName(movie.movieName);
      }
    }

    // Close the dialog
    setOpenMovieDialog(false);
  };

  // Update the movie name when data is loaded
  useEffect(() => {
    if (movies && selectedMovieId) {
      const movie = movies.find((m: any) => m.movieId === selectedMovieId);
      if (movie) {
        setSelectedMovieName(movie.movieName);
      }
    }
  }, [movies, selectedMovieId]);

  const handleRoomChange = (event: any) => {
    setSelectedRoomId(event.target.value);
    setIsModified(true);
  };

  const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(event.target.value);
    setIsModified(true);
  };

  const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndTime(event.target.value);
    setIsModified(true);
  };

  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return "";
    try {
      // Create a date object but keep the time as selected by user
      const dt = new Date(dateTimeString);
      
      // Format 1: yyyy-MM-ddTHH:mm:ss (no timezone, which .NET often prefers)
      const dotNetFormat = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}T${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}:00`;
      
      // Log the formatted date for debugging
      console.log(`Formatted date: ${dotNetFormat}`);
      
      return dotNetFormat;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateTimeString; // Return the original string if formatting fails
    }
  };

  const handleSave = async () => {
    try {
      if (!showtime) return;

      const data = showtime.data || showtime;

      const updatedShowtime = {
        ...data,
        movieId: selectedMovieId,
        roomId: selectedRoomId,
        startTime: formatDateTime(startTime),
        endTime: formatDateTime(endTime)
      };

      await api.put(`showtime/${id}`, updatedShowtime);
      alert('Lịch chiếu đã được cập nhật thành công!');
      setIsModified(false);
    } catch (error) {
      console.error('Error updating showtime:', error);
      alert('Đã xảy ra lỗi khi cập nhật lịch chiếu!');
    }
  };

  const handleBack = () => {
    navigate('/admin/ql-thoi-gian-chieu');
  };

  const handleEdit = () => {
    navigate(`/admin/ql-thoi-gian-chieu/chinh-sua/${id}`);
  };

  if (isLoadingShowtime || isLoadingMovies || isLoadingRooms) return <Loader />;

  if (showtimeError) {
    return (
      <AppTheme disableCustomTheme={disableCustomTheme}>
        <CssBaseline enableColorScheme />
        <Box sx={{ display: 'flex', height: '100vh' }}>
          <SideMenu />
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <AppNavbar />
            <Box component="main" sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: alpha(theme.palette.background.default, 1),
              overflowY: 'auto',
              px: 3,
              py: 2,
            })}>
              <Typography color="error" variant="h6">
                Error: {showtimeError instanceof Error ? showtimeError.message : 'Unknown error'}
              </Typography>
              <Button variant="contained" onClick={handleBack} sx={{ mt: 2 }}>
                Quay lại
              </Button>
            </Box>
          </Box>
        </Box>
      </AppTheme>
    );
  }

  if (!showtime) {
    return (
      <AppTheme disableCustomTheme={disableCustomTheme}>
        <CssBaseline enableColorScheme />
        <Box sx={{ display: 'flex', height: '100vh' }}>
          <SideMenu />
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <AppNavbar />
            <Box component="main" sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: alpha(theme.palette.background.default, 1),
              overflowY: 'auto',
              px: 3,
              py: 2,
            })}>
              <Typography color="error" variant="h6">
                No data found for this showtime
              </Typography>
              <Button variant="contained" onClick={handleBack} sx={{ mt: 2 }}>
                Quay lại
              </Button>
            </Box>
          </Box>
        </Box>
      </AppTheme>
    );
  }

  return (
    <AppTheme disableCustomTheme={disableCustomTheme}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <SideMenu />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <AppNavbar />
          <Box component="main" sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: alpha(theme.palette.background.default, 1),
            overflowY: 'auto',
            px: 3,
            py: 2,
          })}>
            <Stack spacing={2} alignItems="center">
              <Header />
              <Container sx={{
                backgroundColor: '#f5f5f5',
                color: '#000000',
                py: 3,
              }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <TheatersIcon sx={{ mr: 1 }} />
                    Chi tiết lịch chiếu
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">Mã lịch chiếu</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      value={showtime?.data?.showTimeId || showtime?.showTimeId || ''}
                      InputProps={{ readOnly: true }}
                    />
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">Phim</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={selectedMovieName}
                        InputProps={{
                          readOnly: true,
                          startAdornment: selectedMovieId ? <MovieIcon sx={{ mr: 1, color: 'primary.main' }} /> : null,
                        }}
                        placeholder="Chưa chọn phim"
                      />
                      <Button
                        variant="contained"
                        onClick={() => setOpenMovieDialog(true)}
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        Chọn phim
                      </Button>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">Phòng chiếu</Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={selectedRoomId}
                        onChange={handleRoomChange}
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>Không có phòng</em>
                        </MenuItem>
                        {Array.isArray(rooms) && rooms.map((room: any) => (
                          <MenuItem key={room.roomId} value={room.roomId}>
                            {room.roomName || room.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">Thời gian bắt đầu</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      type="datetime-local"
                      value={startTime}
                      onChange={handleStartTimeChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">Thời gian kết thúc</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      type="datetime-local"
                      value={endTime}
                      onChange={handleEndTimeChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>

                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    {isModified ? (
                      <Button
                        variant="contained"
                        color="success"
                        size="large"
                        onClick={handleSave}
                        sx={{ minWidth: 150 }}
                      >
                        Lưu thay đổi
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleEdit}
                        sx={{ minWidth: 150 }}
                      >
                        Chỉnh sửa
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={handleBack}
                      sx={{ minWidth: 150 }}
                    >
                      Quay lại
                    </Button>
                  </Box>
                </Box>
              </Container>
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Movie Selection Dialog */}
      <Dialog
        open={openMovieDialog}
        onClose={() => setOpenMovieDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Chọn phim chiếu</DialogTitle>
        <DialogContent dividers>
          <AdminNowShowingMovies
            onMovieSelect={handleMovieSelect}
            selectedMovieId={selectedMovieId}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMovieDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </AppTheme>
  );
};

export default ChiTietThoiGianChieu;
