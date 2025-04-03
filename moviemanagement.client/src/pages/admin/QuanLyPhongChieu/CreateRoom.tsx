import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import api from '../../../apis/axios.config';

interface MovieTheater {
  movieTheaterId: string;
  name: string;
}

const CreateRoom: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [roomName, setRoomName] = useState('');
  const [rows, setRows] = useState<number>(5);
  const [columns, setColumns] = useState<number>(7);
  const [movieTheaters, setMovieTheaters] = useState<MovieTheater[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  useEffect(() => {
    // Fetch all movie theaters
    const fetchMovieTheaters = async () => {
      try {
        const response = await api.get('movietheater');
        if (response.data.isSuccess) {
          setMovieTheaters(response.data.data);
          if (response.data.data.length > 0) {
            setSelectedTheater(response.data.data[0].movieTheaterId);
          }
        }
      } catch (error) {
        console.error('Error fetching movie theaters:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load movie theaters',
          severity: 'error'
        });
      }
    };

    fetchMovieTheaters();
  }, []);

  const calculateTotal = () => {
    return rows * columns;
  };

  const handleSubmit = async () => {
    if (!roomName || !selectedTheater) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    const roomData = {
      roomName: roomName,
      row: rows,
      column: columns,
      total: calculateTotal()
    };

    try {
      const response = await api.post(
        `room?MovieTheaterId=${selectedTheater}`,
        roomData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.isSuccess) {
        setSnackbar({
          open: true,
          message: 'Room created successfully',
          severity: 'success'
        });
        setIsDialogOpen(false);
        
        // Invalidate the rooms data cache so it will refresh on return
        queryClient.invalidateQueries('PhongChieuData');
        
        // Navigate back to the room list after successful creation
        setTimeout(() => {
          navigate('/admin/ql-phong-chieu');
        }, 1500);
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to create room: ' + response.data.message,
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error creating room:', error);
      setSnackbar({
        open: true,
        message: 'Failed to create room. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TheaterComedyIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" fontWeight="bold">
            Create New Room
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={() => navigate('/admin/ql-phong-chieu')}
          sx={{ borderRadius: 2 }}
        >
          Return to Room List
        </Button>
      </Box>
      
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel id="movie-theater-label">Movie Theater</InputLabel>
              <Select
                labelId="movie-theater-label"
                value={selectedTheater}
                label="Movie Theater"
                onChange={(e) => setSelectedTheater(e.target.value)}
              >
                {movieTheaters.map((theater) => (
                  <MenuItem key={theater.movieTheaterId} value={theater.movieTheaterId}>
                    {theater.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Rows"
              type="number"
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value))}
              inputProps={{ min: 1 }}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Columns"
              type="number"
              value={columns}
              onChange={(e) => setColumns(parseInt(e.target.value))}
              inputProps={{ min: 1 }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="h6">
                Total seats: {calculateTotal()}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleOpenDialog}
              sx={{ minWidth: 200 }}
            >
              Create Room
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Room Creation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to create a room with the following details?
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography><strong>Room Name:</strong> {roomName}</Typography>
            <Typography><strong>Rows:</strong> {rows}</Typography>
            <Typography><strong>Columns:</strong> {columns}</Typography>
            <Typography><strong>Total Seats:</strong> {calculateTotal()}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={5000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateRoom; 