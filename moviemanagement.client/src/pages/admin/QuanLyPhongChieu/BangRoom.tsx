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
  Tooltip
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Room as RoomType } from "../../../types/room.types";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import EditIcon from "@mui/icons-material/Edit";
import TheaterComedyIcon from "@mui/icons-material/TheaterComedy";
import ChairIcon from '@mui/icons-material/Chair';

export interface Room {
  roomId: string;
  roomName: string;
  total: number;
}

interface RoomTableProps {
  rooms: Room[];
  onEdit: (id: string) => void;
  rowHeight?: number;
}

const RoomTable: React.FC<RoomTableProps> = ({ rooms, onEdit }) => {
  const navigate = useNavigate();

  const handleEditClick = (roomId: string) => {
    console.log("Handling click for roomId:", roomId);
    console.log("Available rooms:", rooms);

    if (roomId) {
      navigate(`/admin/ql-phong-chieu/${roomId}`);
    } else {
      console.error("No roomId provided");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <TheaterComedyIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
        <Typography variant="h4" fontWeight="bold">
          Danh sách phòng chiếu
        </Typography>
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
                  <Tooltip title="Chỉnh sửa phòng">
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditClick(room.roomId)}
                      sx={{ 
                        color: 'white', 
                        bgcolor: 'rgba(255,255,255,0.2)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
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
                  
                  <Button 
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={() => handleEditClick(room.roomId)}
                    sx={{ 
                      mt: 'auto', 
                      borderRadius: 2,
                      py: 1
                    }}
                  >
                    Xem chi tiết
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default RoomTable;
