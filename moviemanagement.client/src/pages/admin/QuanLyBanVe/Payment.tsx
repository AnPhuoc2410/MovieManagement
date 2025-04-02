import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  CssBaseline,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Slider,
  Stack,
  Typography
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../apis/axios.config";
import AppNavbar from "../../../components/mui/AppNavbar";
import Header from "../../../components/mui/Header";
import SideMenu from "../../../components/mui/SideMenu";
import UserSearchComponent from "../../../components/shared/UserSearchComponent";
import { phoneRegex } from "../../../constants/regex";
import { useAuth } from "../../../contexts/AuthContext";
import { useSignalR } from "../../../contexts/SignalRContext";
import AppTheme from "../../../shared-theme/AppTheme";
import { UserInfo } from "../../../types/users.type";

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
  const [isPaying, setIsPaying] = useState(false);
  const [usedPoints, setUsedPoints] = useState<number>(0);
  const [maxUsablePoints, setMaxUsablePoints] = useState<number>(0);
  const [partialPointPayment, setPartialPointPayment] = useState<boolean>(false);
  const [selectedTicketsForPoints, setSelectedTicketsForPoints] = useState<string[]>([]);
  const [ticketPointCosts, setTicketPointCosts] = useState<{ [key: string]: number }>({});

  const handleUserSelect = (user: UserInfo) => {
    setSelectedUser(user);
    setPointsToAdd(Math.floor(totalPrice / 10000));
  };

  const handleUsersFound = (foundUsers: UserInfo[]) => {
    setUsers(foundUsers);
  };

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

  const movieTitle = movieData?.movieName || "Phim Mặc Định";
  const showDate = selectedDate;
  const showTime = selectedTime;

  const effectiveShowTimeId =
    showTimeId || sessionStorage.getItem("currentShowTimeId") || "";

  // Calculate total price from tickets array
  const totalPrice = (tickets || []).reduce(
    (sum: number, t: any) => sum + t.price * (t.quantity || 0),
    0
  );

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMethod = e.target.value;
    setPaymentMethod(newMethod);

    if (newMethod === 'points') {
      // For full points payment, use all available points up to the total price
      setUsedPoints(maxUsablePoints);
      setPartialPointPayment(false);
    } else if (newMethod === 'partial_points') {
      // For partial payment, start with half of available points
      setUsedPoints(Math.floor(maxUsablePoints / 2));
      setPartialPointPayment(true);
    } else {
      // For money payment, don't use points
      setUsedPoints(0);
      setPartialPointPayment(false);
    }
  };

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

  useEffect(() => {
    if (selectedUser && tickets.length > 0) {
      const pointCosts = tickets.reduce((acc: { [key: string]: number }, ticket: any, index: number) => {
        const ticketId = selectedSeatsInfo[index]?.ticketId;
        if (ticketId) {
          acc[ticketId] = Math.floor(ticket.price / 100); // Convert price to points (1 point = 1 VND)
        }
        return acc;
      }, {});
      setTicketPointCosts(pointCosts);
    }
  }, [selectedUser, tickets, selectedSeatsInfo]);

  const toggleTicketForPoints = (ticketId: string) => {
    setSelectedTicketsForPoints(prev =>
      prev.includes(ticketId)
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const calculateTotalPointsNeeded = () => {
    return selectedTicketsForPoints.reduce((total, ticketId) =>
      total + (ticketPointCosts[ticketId] || 0), 0);
  };

  const calculateRemainingAmount = () => {
    const ticketsForMoney = tickets.filter((ticket: any, index: number) => {
      const ticketId = selectedSeatsInfo[index]?.ticketId;
      return ticketId && !selectedTicketsForPoints.includes(ticketId);
    });

    return ticketsForMoney.reduce((sum: number, t: any) => sum + t.price, 0);
  };

  // Calculate points that will be earned from money payment
  const calculatePointsToEarn = () => {
    const moneyAmount = calculateRemainingAmount();
    return Math.floor(moneyAmount / 1000); // 1 point per 1000 VND
  };

  useEffect(() => {
    if (selectedUser) {
      const maxPoints = Math.min(selectedUser.point, totalPrice * 100);
      setMaxUsablePoints(maxPoints);
    } else {
      setMaxUsablePoints(0);
      setUsedPoints(0);
    }
  }, [selectedUser, totalPrice]);

  const handlePointsChange = (event: Event, newValue: number | number[]) => {
    setUsedPoints(newValue as number);
  };

  const handleConfirmPayment = async () => {
    setIsPaying(true);
    try {
      // Create the request payload for exchanging tickets
      const payload = {
        totalTicket: seats.length,
        amount: totalPrice,
        tickets: selectedSeatsInfo.map((seat: any) => seat.ticketId),
        promotionId: null,
        usedPoint: usedPoints
      };

      const userId = selectedUser?.id;
      if (userId) {
        // Call the backend API for ticket exchange
        const response = await api.post(`users/test/${userId}`, payload);

        if (response.status === 200) {
          toast.success("Thanh toán thành công!");

          navigate("/admin/ql-ban-ve/confirmation", {
            state: {
              movieId,
              movieData,
              selectedTime,
              selectedDate,
              seats,
              roomName,
              showTimeId: effectiveShowTimeId,
              tickets,
              selectedSeatsInfo,
              totalPrice,
              selectedUser,
              paymentMethod,
              pointsToAdd: paymentMethod === "points" ? 0 : pointsToAdd,
              usedPoints,
              amountPaidWithPoints: usedPoints / 100,
              amountPaidWithMoney: calculateRemainingAmount()
            }
          });
        } else {
          throw new Error("Payment failed");
        }
      } else {
        // Handle case where no user is selected (regular cash payment)
        toast.success("Thanh toán thành công!");
        navigate("/admin/ql-ban-ve/confirmation", {
          state: {
            movieId,
            movieData,
            selectedTime,
            selectedDate,
            seats,
            roomName,
            showTimeId: effectiveShowTimeId,
            tickets,
            selectedSeatsInfo,
            totalPrice,
            paymentMethod: "money"
          }
        });
      }
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

                            {selectedUser && (
                              <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                  Chọn vé thanh toán bằng điểm
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  Điểm hiện có: {selectedUser.point} điểm
                                </Typography>

                                <Box sx={{ mt: 2 }}>
                                  {tickets.map((ticket: any, index: number) => {
                                    const ticketId = selectedSeatsInfo[index]?.ticketId;
                                    const seatName = seats[index];
                                    const pointCost = ticketPointCosts[ticketId] || 0;
                                    const canUsePoints = selectedUser.point >= pointCost;
                                    const isSelected = selectedTicketsForPoints.includes(ticketId);

                                    return (
                                      <Box
                                        key={ticketId}
                                        sx={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                          p: 1,
                                          border: '1px solid',
                                          borderColor: isSelected ? 'primary.main' : 'divider',
                                          borderRadius: 1,
                                          mb: 1,
                                          bgcolor: isSelected ? 'primary.light' : 'background.paper',
                                          opacity: canUsePoints ? 1 : 0.6
                                        }}
                                      >
                                        <Box>
                                          <Typography variant="body1">Ghế {seatName}</Typography>
                                          <Typography variant="body2">
                                            {ticket.price.toLocaleString('vi-VN')}đ ({pointCost} điểm)
                                          </Typography>
                                        </Box>
                                        <Button
                                          variant={isSelected ? "contained" : "outlined"}
                                          size="small"
                                          disabled={!canUsePoints}
                                          onClick={() => toggleTicketForPoints(ticketId)}
                                        >
                                          {isSelected ? "Bỏ chọn" : "Dùng điểm"}
                                        </Button>
                                      </Box>
                                    );
                                  })}
                                </Box>

                                <Box sx={{ mt: 2 }}>
                                  <Typography variant="body1">
                                    Tổng điểm sử dụng: {calculateTotalPointsNeeded()} điểm
                                  </Typography>
                                  <Typography variant="body1">
                                    Điểm còn lại sau giao dịch: {selectedUser.point - calculateTotalPointsNeeded() + calculatePointsToEarn()} điểm
                                  </Typography>
                                </Box>
                              </Box>
                            )}
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

                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                          <Typography variant="body1">Tổng tiền vé:</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {totalPrice.toLocaleString("vi-VN")}đ
                          </Typography>
                        </Box>

                        {selectedTicketsForPoints.length > 0 && (
                          <>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                              <Typography variant="body1">
                                Thanh toán bằng điểm ({selectedTicketsForPoints.length} vé):
                              </Typography>
                              <Typography variant="body1" color="success.main">
                                -{selectedTicketsForPoints.reduce((sum, ticketId) => {
                                  const ticketIndex = selectedSeatsInfo.findIndex((s: { ticketId: string; }) => s.ticketId === ticketId);
                                  return sum + (tickets[ticketIndex]?.price || 0);
                                }, 0).toLocaleString("vi-VN")}đ
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                              <Typography variant="body1">Còn lại thanh toán tiền mặt:</Typography>
                              <Typography variant="body1">
                                {calculateRemainingAmount().toLocaleString("vi-VN")}đ
                              </Typography>
                            </Box>
                          </>
                        )}

                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="h6">Tổng thanh toán:</Typography>
                          <Typography variant="h6" color="primary" fontWeight="bold">
                            {(paymentMethod === 'points' ? 0 :
                              paymentMethod === 'partial_points' ? calculateRemainingAmount() :
                                totalPrice).toLocaleString("vi-VN")}đ
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
