import EventSeatIcon from "@mui/icons-material/EventSeat";
import ScreenshotMonitorIcon from "@mui/icons-material/ScreenshotMonitor";
import TheaterIcon from "@mui/icons-material/TheaterComedy";
import ChairIcon from "@mui/icons-material/Chair";
import GridViewIcon from "@mui/icons-material/GridView";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
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
import { useState } from "react";
import toast from "react-hot-toast";

// Define the SeatType interface if not already defined elsewhere
interface SeatType {
  seatTypeId: string;
  typeName: string;
  price: number;
  quantity?: number;
  isActive?: boolean;
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
  
  // Fetch room data
  const fetchRoom = async (id: string) => {
    const response = await axios.get(`https://localhost:7119/api/room/${id}`);
    return response.data.data;
  };
  
  // Fetch seat types
  const fetchSeatTypes = async () => {
    const response = await axios.get(`https://localhost:7119/api/seattype/all`);
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
      const endpoint = mode === "row" 
        ? `https://localhost:7119/api/seat/addrowseats?roomId=${roomId}&seatTypeId=${seatTypeId}&rowIndex=${index}`
        : `https://localhost:7119/api/seat/addcolumnseats?roomId=${roomId}&seatTypeId=${seatTypeId}&columnIndex=${index}`;
        
      const response = await axios.post(endpoint);
      
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
                
                {updateSuccess && (
                  <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
                    <AlertTitle>Thành công</AlertTitle>
                    Đã cập nhật ghế thành công!
                  </Alert>
                )}
                
                {updateError && (
                  <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                    <AlertTitle>Lỗi</AlertTitle>
                    {updateError}
                  </Alert>
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

              {/* Seats Container */}
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
                    {Array.from({ length: room.row * room.column }).map(
                      (_, index) => {
                        const row = Math.floor(index / room.column);
                        const col = index % room.column;
                        const seatLabel = `${String.fromCharCode(65 + row)}${col + 1}`;
                        
                        // Highlight seats in selected row/column
                        const isHighlighted = 
                          (selectionMode === "row" && selectedIndex === row) ||
                          (selectionMode === "column" && selectedIndex === col);

                        const isFocused =  
                          selectionMode === "row" && selectedIndex === row && selectedIndex === col;

                        return (
                          <Box
                            key={index}
                            sx={{
                              width: "40px",
                              height: "40px",
                              backgroundColor: isHighlighted ? 
                                theme.palette.primary.main : 
                                "#ffffff",
                              border: "1px solid",
                              borderColor: isHighlighted ? 
                                theme.palette.primary.dark : 
                                "#e0e0e0",
                              borderRadius: "4px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              fontSize: "0.9rem",
                              color: isHighlighted ? "white" : "#5f6368",
                              transition: "all 0.15s ease",
                              boxShadow: isHighlighted ? 
                                'none' : 
                                'inset 0 -2px 0 0 rgba(0,0,0,0.1)',
                              "&:hover": {
                                transform: "translateY(-2px)",
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
                </Box>
              </Paper>

              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                bgcolor: alpha('#f5f5f5', 0.5),
                p: 1.5,
                borderRadius: 2
              }}>
                <Typography variant="body2" sx={{ color: "text.secondary", fontStyle: 'italic' }}>
                  * Chú thích: Các ghế được đánh số theo định dạng [Hàng][Cột]
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </ManagementPageLayout>
  );
};

export default ChiTietPhongChieu;
