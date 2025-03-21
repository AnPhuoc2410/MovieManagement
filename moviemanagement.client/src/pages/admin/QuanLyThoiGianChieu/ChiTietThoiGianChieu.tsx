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
import { format } from 'date-fns';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MovieIcon from '@mui/icons-material/Movie';
import TheatersIcon from '@mui/icons-material/Theaters';
import EventIcon from '@mui/icons-material/Event';
import AppNavbar from '../../../components/mui/AppNavbar';
import Header from '../../../components/mui/Header';
import SideMenu from '../../../components/mui/SideMenu';
import AppTheme from '../../../shared-theme/AppTheme';

const ChiTietThoiGianChieu = ({ disableCustomTheme = false }: { disableCustomTheme?: boolean }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch showtime details
  const { data: showtime, isLoading: isLoadingShowtime, error: showtimeError } = useQuery<ShowTime, Error>(
    ['showtime', id],
    async () => {
      try {
        const response = await axios.get<ShowTime>(`https://localhost:7119/api/showtime/${id}`);
        console.log('API Response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching showtime:', error);
        throw error;
      }
    }
  );

  // Fetch movies list
  const { data: movies, isLoading: isLoadingMovies } = useQuery(
    'movies',
    async () => {
      const response = await axios.get('https://localhost:7119/api/movie/all');
      console.log('Movies API Response:', response.data);
      return Array.isArray(response.data) ? response.data : response.data.data || [];
    }
  );

  // Fetch rooms list
  const { data: rooms, isLoading: isLoadingRooms } = useQuery(
    'rooms',
    async () => {
      const response = await axios.get('https://localhost:7119/api/room/all');
      console.log('Rooms API Response:', response.data);
      return Array.isArray(response.data) ? response.data : response.data.data || [];
    }
  );

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
                Error: {showtimeError.message}
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
                      value={showtime.showTimeId}
                      InputProps={{ readOnly: true }}
                    />
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">Phim</Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={showtime.movieId || ''}
                        disabled
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>Không có phim</em>
                        </MenuItem>
                        {Array.isArray(movies) && movies.map((movie: any) => (
                          <MenuItem key={movie.movieId} value={movie.movieId}>
                            {movie.title || movie.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">Phòng chiếu</Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={showtime.roomId || ''}
                        disabled
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>Không có phòng</em>
                        </MenuItem>
                        {Array.isArray(rooms) && rooms.map((room: any) => (
                          <MenuItem key={room.roomId} value={room.roomId}>
                            {room.name}
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
                      value={format(new Date(showtime.startTime), 'dd/MM/yyyy HH:mm')}
                      InputProps={{ readOnly: true }}
                    />
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">Thời gian kết thúc</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      value={format(new Date(showtime.endTime), 'dd/MM/yyyy HH:mm')}
                      InputProps={{ readOnly: true }}
                    />
                  </Box>

                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={handleEdit}
                      sx={{ minWidth: 150 }}
                    >
                      Chỉnh sửa
                    </Button>
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
    </AppTheme>
  );
};

export default ChiTietThoiGianChieu;