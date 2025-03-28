import React, { useEffect, useState } from "react";
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
  FormLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { alpha } from "@mui/material/styles";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../apis/axios.config";
import { useSignalR } from "../../../contexts/SignalRContext";
import AppNavbar from "../../../components/mui/AppNavbar";
import Header from "../../../components/mui/Header";
import SideMenu from "../../../components/mui/SideMenu";
import AppTheme from "../../../shared-theme/AppTheme";
import { UserInfo } from "../../../types/users.type";
import { phoneRegex } from "../../../constants/regex";
import { useAuth } from "../../../contexts/AuthContext";
import UserSearchComponent from "../../../components/shared/UserSearchComponent";

/**
 * This is a placeholder interface for seats/tickets in your location.state.
 * You can replace it with the actual type from your codebase if available.
 */
interface SeatInfo {
  ticketId: string;
  version: number;
}

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { connection, isConnected } = useSignalR();
  const { userDetails } = useAuth();

  // Theme & loading states
  const [disableCustomTheme] = useState<boolean>(false);
  const [isSearchingUser, setIsSearchingUser] = useState(false);

  // Payment & user states
  const [userSearchInput, setUserSearchInput] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [pointsToAdd, setPointsToAdd] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("money");
  const [isPaying, setIsPaying] = useState(false); // for final payment flow
  const handleUserSelect = (user: UserInfo) => {
    setSelectedUser(user);
    setPointsToAdd(Math.floor(totalPrice / 10000));
  };

  const handleUsersFound = (foundUsers: UserInfo[]) => {
    setUsers(foundUsers);
  };

  // Location state destructuring
  const {
    movieId,
    selectedTime = "Not selected",
    selectedDate = "Not selected",
    tickets = [],
    seats = [] as string[],
    showTimeId = "",
    selectedSeatsInfo = [] as SeatInfo[],
    movieData = null,
    roomName = "",
  } = location.state || {};

  // Derive info from location state
  const movieTitle = movieData?.movieName || "Phim Mặc Định";
  const showDate = selectedDate;
  const showTime = selectedTime;

  // Effective showTimeId from state or fallback to session storage
  const effectiveShowTimeId =
    showTimeId || sessionStorage.getItem("currentShowTimeId") || "";

  // Calculate total price from tickets array
  const totalPrice = (tickets || []).reduce(
    (sum: number, t: any) => sum + t.price * (t.quantity || 0),
    0
  );

  /**
   * Handler for payment method changes (tiền mặt vs. điểm)
   */
  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };

  /**
   * Release seats if user refreshes or closes tab
   * using sendBeacon to ensure the request is sent.
   */
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (
        connection &&
        isConnected &&
        effectiveShowTimeId &&
        selectedSeatsInfo.length > 0
      ) {
        e.preventDefault();
        e.returnValue = "";

        const userId = userDetails?.userId;
        const payload = JSON.stringify({
          ticketRequests: selectedSeatsInfo.map((seat: { ticketId: any; version: any; }) => ({
            TicketId: seat.ticketId,
            Version: seat.version,
          })),
          showtimeId: effectiveShowTimeId,
          userId,
        });

        // Attempt to release seats via beacon
        navigator.sendBeacon("/api/seats/release-pending", payload);
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [connection, isConnected, effectiveShowTimeId, selectedSeatsInfo]);

  /**
   * Cleanup seats on component unmount
   * using SignalR's ReleasePendingSeats method.
   */
  useEffect(() => {
    return () => {
      if (connection && isConnected && selectedSeatsInfo.length > 0) {
        const userId = userDetails?.userId;
        const ticketRequests = selectedSeatsInfo.map((seat: { ticketId: any; version: any; }) => ({
          TicketId: seat.ticketId,
          Version: seat.version,
        }));

        connection
          .invoke("ReleasePendingSeats", ticketRequests, effectiveShowTimeId, userId)
          .catch((err) =>
            console.error("Failed to release seats on unmount:", err)
          );
      }
    };
  }, [connection, isConnected, selectedSeatsInfo, effectiveShowTimeId]);

  /**
   * Navigate back and release seats if needed.
   */
  const handleBack = async () => {
    if (connection && selectedSeatsInfo.length > 0) {
      try {
        const userId = userDetails?.userId;
        const ticketRequests = selectedSeatsInfo.map((seat: { ticketId: any; version: any; }) => ({
          TicketId: seat.ticketId,
          Version: seat.version,
        }));

        await connection.invoke(
          "ReleasePendingSeats",
          ticketRequests,
          effectiveShowTimeId,
          userId
        );
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

  useEffect(() => {
    if (userSearchInput.trim() === "") {
      setSelectedUser(null);
      setPointsToAdd(0);
      setUsers([]);
    }
  }, [userSearchInput]);

  const handleSearchUser = async () => {
    if (!userSearchInput.trim()) {
      toast.error("Vui lòng nhập CMND hoặc số điện thoại");
      return;
    }

    setIsSearchingUser(true);
    setUsers([]); // clear previous results
    try {
      // Check if user input is phone or ID card
      const isPhoneNumber = phoneRegex.test(userSearchInput.replace(/\s/g, ""));
      const searchParam = isPhoneNumber ? "phone" : "idCard";

      const response = await api.get(
        `/users/find?${searchParam}=${encodeURIComponent(userSearchInput)}`
      );

      const data = response.data.data;
      if (!data) {
        // No user found
        setSelectedUser(null);
        toast.error("Không tìm thấy thành viên nào");
        return;
      }

      // If API returns an array of users
      if (Array.isArray(data)) {
        setUsers(data);
        // If exactly one user in array, select them
        if (data.length === 1) {
          setSelectedUser(data[0]);
          setPointsToAdd(Math.floor(totalPrice / 10000));
        } else {
          // Multiple results, user can pick from the list
          setSelectedUser(null);
          toast.success(`${data.length} kết quả được tìm thấy`);
        }
      } else {
        // Single user object
        setSelectedUser(data);
        setPointsToAdd(Math.floor(totalPrice / 10000));
      }
    } catch (error) {
      console.error("Error searching for user:", error);
      toast.error("Lỗi khi tìm kiếm người dùng");
      setSelectedUser(null);
    } finally {
      setIsSearchingUser(false);
    }
  };

  /**
   * Handler to select a user from multiple search results
   */
  const handleSelectUser = (user: UserInfo) => {
    setSelectedUser(user);
    setPointsToAdd(Math.floor(totalPrice / 10000));
    setUsers([]); // hide the search results after selection
  };

  const handleConfirmPayment = async () => {
    setIsPaying(true);
    try {
      toast.success("Thanh toán thành công!");
      navigate("/admin/ql-ban-ve/confirmation", {
        state: {
          // Pass movie and booking information
          movieId,
          movieData,
          selectedTime,
          selectedDate,
          seats,
          roomName,
          showTimeId: effectiveShowTimeId,

          // Pass ticket and payment information
          tickets,
          selectedSeatsInfo,
          totalPrice,

          // Pass user and payment method
          selectedUser,
          paymentMethod,

          // Add any additional data you might need
          pointsToAdd
        }
      });
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Lỗi khi thanh toán");
    } finally {
      setIsPaying(false);
    }
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
                  width: "100%",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                {/* Title */}
                <Box
                  sx={{
                    p: 3,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="h5" fontWeight="bold">
                    Thanh Toán Vé
                  </Typography>
                </Box>

                {/* Main Content */}
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {/* Left Column: Movie Poster & Basic Info */}
                    <Grid item xs={12} md={4}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
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
                            <strong>Ghế:</strong>{" "}
                            {seats.join(", ") || "Chưa chọn ghế"}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>

                    {/* Right Column: Payment Info & Customer Form */}
                    <Grid item xs={12} md={8}>
                      {/* Customer Information Section */}
                      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                          Thông Tin Khách Hàng
                        </Typography>
                        <UserSearchComponent
                          totalPrice={totalPrice}
                          onUserSelect={handleUserSelect}
                          onUsersFound={handleUsersFound}
                        />

                        {/* Display selected user info if found */}
                        {selectedUser ? (
                          <Box
                            sx={{
                              p: 3,
                              bgcolor: "background.paper",
                              borderRadius: 2,
                              boxShadow: 1,
                            }}
                          >
                            <Box
                              sx={{ display: "flex", alignItems: "center", mb: 2 }}
                            >
                              <Avatar
                                src={selectedUser.avatarUrl}
                                alt={selectedUser.userName}
                                sx={{ width: 64, height: 64, mr: 2 }}
                              >
                                {selectedUser.userName?.charAt(0)}
                              </Avatar>
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                  {selectedUser.userName}
                                </Typography>
                                <Grid container spacing={1}>
                                  <Grid item xs={12} sm={6}>
                                    <Typography variant="body2">
                                      <strong>Email:</strong>{" "}
                                      {selectedUser.email}
                                    </Typography>
                                    <Typography variant="body2">
                                      <strong>SĐT:</strong>{" "}
                                      {selectedUser.phoneNumber}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Typography variant="body2">
                                      <strong>CMND/CCCD:</strong>{" "}
                                      {selectedUser.idCard}
                                    </Typography>
                                    <Typography variant="body2">
                                      <strong>Họ tên:</strong>{" "}
                                      {selectedUser.userName}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Box>
                              <Chip
                                label={`${selectedUser.point} điểm`}
                                color="primary"
                                sx={{ ml: "auto" }}
                              />
                            </Box>

                            <Alert severity="info" sx={{ mb: 2 }}>
                              Với hóa đơn{" "}
                              {totalPrice.toLocaleString("vi-VN")}đ, thành viên sẽ
                              nhận được {pointsToAdd} điểm thưởng khi thanh toán.
                            </Alert>

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mt: 2,
                              }}
                            >
                              <Typography>
                                <strong>Điểm hiện tại:</strong>{" "}
                                {selectedUser.point}
                              </Typography>
                              <Typography>
                                <strong>Sau giao dịch:</strong>{" "}
                                {selectedUser.point + pointsToAdd}
                              </Typography>
                            </Box>

                            <Box sx={{ mt: 3 }}>
                              <FormControl component="fieldset">
                                <FormLabel component="legend">
                                  Hình thức thanh toán
                                </FormLabel>
                                <RadioGroup
                                  row
                                  value={paymentMethod}
                                  onChange={handlePaymentMethodChange}
                                >
                                  <FormControlLabel
                                    value="money"
                                    control={<Radio />}
                                    label="Tiền mặt"
                                  />
                                  <FormControlLabel
                                    value="points"
                                    control={<Radio />}
                                    label="Dùng điểm"
                                    disabled={selectedUser.point < totalPrice / 1000}
                                  />
                                </RadioGroup>
                              </FormControl>
                            </Box>
                          </Box>
                        ) : (
                          <Alert severity="info" sx={{ mb: 2 }}>
                            Khách hàng không phải thành viên sẽ không tích lũy
                            điểm từ giao dịch này
                          </Alert>
                        )}
                      </Paper>

                      {/* Price & Payment Section */}
                      <Paper elevation={1} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                          Thông Tin Thanh Toán
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography variant="body1">Tổng tiền vé:</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {totalPrice.toLocaleString("vi-VN")}đ
                          </Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="h6">Tổng thanh toán:</Typography>
                          <Typography variant="h6" color="primary" fontWeight="bold">
                            {totalPrice.toLocaleString("vi-VN")}đ
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            mt: 3,
                            gap: 2,
                          }}
                        >
                          <Button variant="outlined" onClick={handleBack}>
                            Quay lại
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleConfirmPayment}
                            disabled={isPaying}
                          >
                            {isPaying ? (
                              <CircularProgress size={20} color="inherit" />
                            ) : (
                              "Xác nhận đặt vé"
                            )}
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
