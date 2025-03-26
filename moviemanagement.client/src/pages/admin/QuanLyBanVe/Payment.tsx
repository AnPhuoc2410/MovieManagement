import {
  Box,
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  CssBaseline,
  Stack,
  FormControl,
  InputAdornment,
  Divider,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { alpha } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../apis/axios.config";
import { useSignalR } from "../../../contexts/SignalRContext";
import AppNavbar from "../../../components/mui/AppNavbar";
import Header from "../../../components/mui/Header";
import SideMenu from "../../../components/mui/SideMenu";
import AppTheme from "../../../shared-theme/AppTheme";
import { UserInfo } from "../../../types/users.type";


const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { connection, isConnected } = useSignalR();
  const [disableCustomTheme] = useState<boolean>(false);
  const [isSearchingUser, setIsSearchingUser] = useState(false);
  const [userSearchInput, setUserSearchInput] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [pointsToAdd, setPointsToAdd] = useState<number>(0);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("money");

  // Handler for payment method change
  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };

  const {
    movieId,
    selectedTime = "Not selected",
    selectedDate = "Not selected",
    tickets = [],
    seats = [] as string[],
    showTimeId = "",
    selectedSeatsInfo = [],
    movieData = null,
    roomName = "",
  } = location.state || {};

  const movieTitle = movieData?.movieName || "Phim Mặc Định";
  const showDate = selectedDate;
  const showTime = selectedTime;

  // Determine effective showTimeId from state or session storage
  const effectiveShowTimeId =
    showTimeId || sessionStorage.getItem("currentShowTimeId") || "";

  // Before unload handler to warn user if they refresh or leave
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (connection && isConnected && effectiveShowTimeId && selectedSeatsInfo?.length) {
        e.preventDefault();
        e.returnValue = "";

        const userId = localStorage.getItem("userId") || "anonymous";
        const payload = JSON.stringify({
          ticketRequests: selectedSeatsInfo.map((seat: { ticketId: any; version: any; }) => ({
            TicketId: seat.ticketId,
            Version: seat.version
          })),
          showtimeId: effectiveShowTimeId,
          userId
        });

        navigator.sendBeacon('/api/seats/release-pending', payload);
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [connection, isConnected, effectiveShowTimeId, selectedSeatsInfo]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (connection && isConnected && selectedSeatsInfo?.length > 0) {
        const userId = localStorage.getItem("userId") || "anonymous";
        const ticketRequests = selectedSeatsInfo.map((seat: { ticketId: any; version: any; }) => ({
          TicketId: seat.ticketId,
          Version: seat.version,
        }));

        connection.invoke("ReleasePendingSeats", ticketRequests, effectiveShowTimeId, userId)
          .catch(err => console.error("Failed to release seats on unmount:", err));
      }
    };
  }, [connection, isConnected, selectedSeatsInfo, effectiveShowTimeId]);

  const handleBack = async () => {
    if (connection && selectedSeatsInfo?.length > 0) {
      try {
        const userId = localStorage.getItem("userId") || "anonymous";
        const ticketRequests = selectedSeatsInfo.map((seat: { ticketId: any; version: any; }) => ({
          TicketId: seat.ticketId,
          Version: seat.version
        }));

        await connection.invoke("ReleasePendingSeats", ticketRequests, effectiveShowTimeId, userId);
        toast.success("Đã hủy đặt chỗ");
        navigate(-1);
      } catch (error) {
        console.error("Error releasing seats:", error);
        toast.error("Lỗi khi hủy đặt chỗ");
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  // Calculate total price
  const totalPrice = (tickets || []).reduce(
    (sum: number, t: any) => sum + t.price * (t.quantity || 0),
    0
  );

  // Search for users using CMND or IDCard
  const handleSearchUser = async () => {
    if (!userSearchInput.trim()) {
      toast.error("Vui lòng nhập CMND hoặc IDCard");
      return;
    }

    setIsSearchingUser(true);
    try {
      const response = await api.get(`/users/search-by-id?query=${encodeURIComponent(userSearchInput)}`);
      if (response.data) {
        setSelectedUser(response.data);
        // Calculate points to add (1 point for each 10,000 VND)
        setPointsToAdd(Math.floor(totalPrice / 10000));
      } else {
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Error searching for user:", error);
      toast.error("Lỗi khi tìm kiếm người dùng");
      setSelectedUser(null);
    } finally {
      setIsSearchingUser(false);
    }
  };

  // Select a user from search results (if you want to allow selection from multiple search results)
  const handleSelectUser = (user: UserInfo) => {
    setSelectedUser(user);
    setPointsToAdd(Math.floor(totalPrice / 10000));
  };

  return (
    <AppTheme disableCustomTheme={disableCustomTheme}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", height: "100vh" }}>
        <SideMenu />
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <AppNavbar />
          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: alpha(theme.palette.background.default, 1),
              overflowY: "auto",
              px: 3,
              py: 2,
            })}
          >
            <Stack spacing={3}>
              <Header />
              <Paper
                elevation={2}
                sx={{
                  width: '100%',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="h5" fontWeight="bold">
                    Thanh Toán Vé
                  </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {/* Left Column: Movie Poster */}
                    <Grid item xs={12} md={4}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Box
                          component="img"
                          src={movieData?.image}
                          alt={movieData?.movieName || "Movie Poster"}
                          sx={{
                            width: "100%",
                            borderRadius: 2,
                            objectFit: "contain",
                            maxHeight: 400,
                            mb: 2,
                          }}
                        />
                        <Typography variant="h6" gutterBottom>
                          {movieTitle}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body1" gutterBottom>
                            <strong>Phòng chiếu:</strong> {roomName}
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            <strong>Ngày chiếu:</strong> {showDate}
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            <strong>Giờ chiếu:</strong> {showTime}
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            <strong>Ghế:</strong> {seats.join(", ") || "Chưa chọn ghế"}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                    {/* Right Column: Payment Info & Customer Form */}
                    <Grid item xs={12} md={8}>
                      {/* Member Points Section */}
                      <Paper
                        elevation={1}
                        sx={{
                          p: 3,
                          mb: 3
                        }}
                      >
                        <Typography variant="h6" gutterBottom>
                          Thành Viên
                        </Typography>
                        <Box sx={{ mb: 3 }}>
                          <TextField
                            label="Tìm kiếm thành viên (CMND hoặc IDCard)"
                            variant="outlined"
                            fullWidth
                            value={userSearchInput}
                            onChange={(e) => setUserSearchInput(e.target.value)}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Button
                                    onClick={handleSearchUser}
                                    disabled={isSearchingUser}
                                    startIcon={isSearchingUser ? <CircularProgress size={20} /> : <SearchIcon />}
                                  >
                                    Tìm
                                  </Button>
                                </InputAdornment>
                              ),
                            }}
                            sx={{ mb: 2 }}
                          />
                          {/* Display search results if any */}
                          {users.length > 0 && (
                            <Paper variant="outlined" sx={{ p: 2, maxHeight: 200, overflowY: 'auto' }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Kết quả tìm kiếm:
                              </Typography>
                              <Stack spacing={1}>
                                {users.map(user => (
                                  <Box
                                    key={user.id}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      p: 1,
                                      borderRadius: 1,
                                      '&:hover': {
                                        bgcolor: 'action.hover'
                                      }
                                    }}
                                  >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Avatar src={user.avatarUrl} alt={user.userName}>
                                        {user.userName.charAt(0)}
                                      </Avatar>
                                      <Box>
                                        <Typography variant="body1">{user.userName}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          {user.email} • Điểm: {user.membershipPoints}
                                        </Typography>
                                      </Box>
                                    </Box>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      onClick={() => handleSelectUser(user)}
                                    >
                                      Chọn
                                    </Button>
                                  </Box>
                                ))}
                              </Stack>
                            </Paper>
                          )}
                        </Box>
                        {selectedUser && (
                          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Avatar
                                src={selectedUser.avatarUrl}
                                alt={selectedUser.userName}
                                sx={{ width: 56, height: 56, mr: 2 }}
                              >
                                {selectedUser.userName.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="h6">{selectedUser.userName}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {selectedUser.email} • {selectedUser.phoneNumber}
                                </Typography>
                              </Box>
                              <Chip
                                label={`${selectedUser.membershipPoints} điểm`}
                                color="primary"
                                sx={{ ml: 'auto' }}
                              />
                            </Box>
                            <Alert severity="info" sx={{ mb: 2 }}>
                              Với hóa đơn {totalPrice.toLocaleString('vi-VN')}đ, thành viên sẽ nhận được {pointsToAdd} điểm thưởng khi thanh toán.
                            </Alert>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography>
                                <strong>Điểm hiện tại:</strong> {selectedUser.membershipPoints}
                              </Typography>
                              <Typography>
                                <strong>Sau giao dịch:</strong> {selectedUser.membershipPoints + pointsToAdd}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                        {!selectedUser && (
                          <Alert severity="info">
                            Khách hàng không phải thành viên sẽ không tích lũy điểm từ giao dịch này
                          </Alert>
                        )}
                      </Paper>
                      {/* Customer Information Form */}
                      <Paper
                        elevation={1}
                        sx={{
                          p: 3,
                          mb: 3,
                        }}
                      >
                        <Typography variant="h6" gutterBottom>
                          Thông Tin Khách Hàng
                        </Typography>
                        {selectedUser ? (
                          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                            <Typography variant="h6">{selectedUser.userName}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              CMND: {selectedUser.id} • {selectedUser.phoneNumber}
                            </Typography>
                            <Chip label={`${selectedUser.membershipPoints} điểm`} color="primary" />
                          </Box>
                        ) : (
                          <Alert severity="warning">Không tìm thấy người dùng</Alert>
                        )}
                        <Box sx={{ mt: 3 }}>
                          <FormControl component="fieldset">
                            <FormLabel component="legend">Hình thức thanh toán</FormLabel>
                            <RadioGroup
                              row
                              value={paymentMethod}
                              onChange={handlePaymentMethodChange}
                            >
                              <FormControlLabel value="money" control={<Radio />} label="Tiền mặt" />
                              {selectedUser && (
                                <FormControlLabel value="points" control={<Radio />} label="Dùng điểm" />
                              )}
                            </RadioGroup>
                          </FormControl>
                        </Box>
                      </Paper>
                      {/* Price Information */}
                      <Paper
                        elevation={1}
                        sx={{
                          p: 3,
                        }}
                      >
                        <Typography variant="h6" gutterBottom>
                          Thông Tin Thanh Toán
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body1">Tổng tiền vé:</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {totalPrice.toLocaleString("vi-VN")}đ
                          </Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="h6">Tổng thanh toán:</Typography>
                          <Typography variant="h6" color="primary" fontWeight="bold">
                            {totalPrice.toLocaleString("vi-VN")}đ
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                          <Button variant="outlined" onClick={handleBack}>
                            Quay lại
                          </Button>
                          <Button variant="contained" color="primary">
                            Xác nhận đặt vé
                          </Button>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Stack>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
};

export default Payment;
