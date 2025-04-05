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
  Stack,
  Tooltip,
  Typography,
  Badge
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import React, { useEffect, useState, useMemo } from "react";
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
import InfoIcon from '@mui/icons-material/Info';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

interface SeatInfo {
  ticketId: string;
  version: number;
}

interface TicketInfo {
  id: string;
  price: number;
  quantity: number;
  type: string;
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
  const [isPaying, setIsPaying] = useState(false);

  // Enhanced point system
  const [pointsToUse, setPointsToUse] = useState<number>(0);
  const [pointConversionRate] = useState<number>(100); // 1 point = 100 VND
  const [pointSelectionType, setPointSelectionType] = useState<string>("none");

  const handleUsersFound = (foundUsers: UserInfo[]) => {
    setUsers(foundUsers);
  };

  const {
    movieId,
    selectedTime = "Not selected",
    selectedDate = "Not selected",
    tickets = [] as TicketInfo[],
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

  // Sort tickets by price (highest to lowest) to optimize point usage
  const expandedTickets = useMemo(() => {
    const expanded: TicketInfo[] = [];

    if (!tickets || tickets.length === 0) return expanded;

    tickets.forEach((ticket: { quantity: number; id: any; price: any; type: any; }) => {
      // Create multiple entries for each ticket based on quantity
      for (let i = 0; i < ticket.quantity; i++) {
        expanded.push({
          id: ticket.id,
          price: ticket.price,
          quantity: 1,
          type: ticket.type
        });
      }
    });

    // Sort by price (highest to lowest)
    return expanded.sort((a, b) => b.price - a.price);
  }, [tickets]);

  // Calculate points needed for each ticket option - improved for clarity
  const getPointsForTickets = (ticketCount: number) => {
    if (ticketCount <= 0 || !expandedTickets.length) return 0;

    let pointsNeeded = 0;
    const ticketsToExchange = Math.min(ticketCount, expandedTickets.length);

    for (let i = 0; i < ticketsToExchange; i++) {
      pointsNeeded += Math.ceil(expandedTickets[i].price / pointConversionRate);
    }

    return pointsNeeded;
  };

  // Calculate maximum number of tickets user can exchange with their points - improved logic
  const getMaxExchangeableTickets = () => {
    if (!selectedUser || !expandedTickets.length) return 0;

    let remainingPoints = selectedUser.point;
    let ticketCount = 0;

    for (const ticket of expandedTickets) {
      const pointsForTicket = Math.ceil(ticket.price / pointConversionRate);
      if (remainingPoints >= pointsForTicket) {
        remainingPoints -= pointsForTicket;
        ticketCount++;
      } else {
        break;
      }
    }

    return ticketCount;
  };

  // Get detailed information about each ticket option for display
  const getTicketExchangeOptions = useMemo(() => {
    if (!selectedUser || !expandedTickets.length) return [];

    const options = [];
    let cumulativePoints = 0;
    let cumulativeValue = 0;

    for (let i = 0; i < expandedTickets.length; i++) {
      const ticket = expandedTickets[i];
      const pointsForThisTicket = Math.ceil(ticket.price / pointConversionRate);
      cumulativePoints += pointsForThisTicket;
      cumulativeValue += ticket.price;

      // Only add options the user has enough points for
      if (selectedUser.point >= cumulativePoints) {
        // Group ticket types for display
        const types: Record<string, number> = {};
        expandedTickets.slice(0, i + 1).forEach(t => {
          types[t.type] = (types[t.type] || 0) + 1;
        });

        // Format ticket type string (e.g., "Adult x2, Child x1")
        const ticketTypeString = Object.entries(types)
          .map(([type, count]) => `${type}${count > 1 ? ` x${count}` : ''}`)
          .join(', ');

        options.push({
          ticketCount: i + 1,
          pointsRequired: cumulativePoints,
          monetaryValue: cumulativeValue,
          ticketTypes: ticketTypeString
        });
      } else {
        break;
      }
    }

    return options;
  }, [selectedUser, expandedTickets, pointConversionRate]);

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
  }, [connection, isConnected, effectiveShowTimeId, selectedSeatsInfo, userDetails]);

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
  }, [connection, isConnected, selectedSeatsInfo, effectiveShowTimeId, userDetails]);

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
      setPointsToUse(0);
      setPointSelectionType("none");
      setUsers([]);
    }
  }, [userSearchInput]);

  const handleSearchUser = async () => {
    if (!userSearchInput.trim()) {
      toast.error("Vui lòng nhập CMND hoặc số điện thoại");
      return;
    }

    setIsSearchingUser(true);
    setUsers([]);
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

      if (Array.isArray(data)) {
        setUsers(data);
        // If exactly one user in array, select them
        if (data.length === 1) {
          handleUserSelect(data[0]);
        } else {
          // Multiple results, user can pick from the list
          setSelectedUser(null);
          toast.success(`${data.length} kết quả được tìm thấy`);
        }
      } else {
        // Single user object
        handleUserSelect(data);
      }
    } catch (error) {
      console.error("Error searching for user:", error);
      toast.error("Lỗi khi tìm kiếm người dùng");
      setSelectedUser(null);
    } finally {
      setIsSearchingUser(false);
    }
  };

  const handleUserSelect = (user: UserInfo) => {
    setSelectedUser(user);
    setPointSelectionType("none"); // Reset to no points used when selecting user
    setPointsToUse(0);
  };

  /**
   * Handler to select a user from multiple search results
   */
  const handleSelectUser = (user: UserInfo) => {
    handleUserSelect(user);
    setUsers([]); // hide the search results after selection
  };

  // Calculate the point value in VND
  const calculatePointValue = (points: number) => {
    return points * pointConversionRate;
  };

  // Calculate remaining amount to pay with money
  const calculateRemainingAmount = () => {
    const pointsValue = calculatePointValue(pointsToUse);
    return Math.max(0, totalPrice - pointsValue);
  };

  // Calculate points that will be earned from money payment
  const calculatePointsToEarn = () => {
    const moneyAmount = calculateRemainingAmount();
    return Math.floor(moneyAmount / 10000); // 1 point per 10,000 VND
  };

  const calculateNetPointsChange = () => {
    return calculatePointsToEarn() - pointsToUse;
  };

  // Enhanced points selection handler
  const handlePointSelectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPointSelectionType(value);

    switch (value) {
      case "none":
        setPointsToUse(0);
        break;
      case "one":
        setPointsToUse(getPointsForTickets(1));
        break;
      case "two":
        setPointsToUse(getPointsForTickets(2));
        break;
      case "all":
        setPointsToUse(getPointsForTickets(expandedTickets.length));
        break;
      default:
        setPointsToUse(0);
        break;
    }
  };

  const handleConfirmPayment = async () => {
    setIsPaying(true);
    try {
      const ticketIds = selectedSeatsInfo.map((seat: any) => seat.ticketId);

      if (selectedUser) {
        // Calculate the amount paid with points and with money
        const pointsValue = calculatePointValue(pointsToUse);
        const remainingAmount = calculateRemainingAmount();
        const pointsToEarn = calculatePointsToEarn();

        const memberPayload = {
          tickets: ticketIds,
          usedPoint: pointsToUse,
          totalTicket: seats.length,
          amount: totalPrice,
          promotionId: null
        };

        const userId = selectedUser.userId;
        console.log("User ID:", userId);
        console.log("Member Payload:", memberPayload);
        const response = await api.post(`users/tickets/member?userId=${userId}`, memberPayload);

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
              pointsUsed: pointsToUse,
              pointsUsedValue: pointsValue,
              pointsToEarn: pointsToEarn,
              netPointsChange: calculateNetPointsChange(),
              amountPaidWithMoney: remainingAmount
            }
          });
        } else {
          throw new Error("Payment failed");
        }
      } else {
        const guestPayload = {
          tickets: ticketIds,
          totalTicket: seats.length,
          amount: totalPrice,
          promotionId: null
        };

        const response = await api.post('users/tickets/guest', guestPayload);

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
              paymentMethod: "money"
            }
          });
        } else {
          throw new Error("Payment failed");
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Lỗi khi thanh toán");
    } finally {
      setIsPaying(false);
    }
  };

  // Enhanced points selection UI
  const renderPointsSelectionSection = () => {
    if (!selectedUser) {
      return null;
    }

    const maxExchangeableTickets = getMaxExchangeableTickets();
    const exchangeOptions = getTicketExchangeOptions;
    
    if (maxExchangeableTickets === 0) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          Số điểm hiện có ({selectedUser.point} điểm) không đủ để đổi vé
        </Alert>
      );
    }

    const pointsForOneTicket = getPointsForTickets(1);
    const pointsForTwoTickets = getPointsForTickets(2);
    const pointsForAllTickets = getPointsForTickets(expandedTickets.length);

    // Group ticket types for "one ticket" option
    const oneTicketType = expandedTickets[0]?.type || '';
    
    // Group ticket types for "two tickets" option
    const twoTicketTypes: Record<string, number> = {};
    if (maxExchangeableTickets >= 2) {
      expandedTickets.slice(0, 2).forEach(t => {
        twoTicketTypes[t.type] = (twoTicketTypes[t.type] || 0) + 1;
      });
    }
    const twoTicketTypesString = Object.entries(twoTicketTypes)
      .map(([type, count]) => `${type}${count > 1 ? ` x${count}` : ''}`)
      .join(', ');

    return (
      <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, boxShadow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Badge 
            badgeContent={selectedUser.point} 
            color="primary" 
            max={9999}
            sx={{ '& .MuiBadge-badge': { fontSize: '0.8rem', padding: '0 6px' } }}
          >
            <LocalOfferIcon color="action" />
          </Badge>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Điểm thành viên hiện có: <strong>{selectedUser.point}</strong> (tương đương {(selectedUser.point * pointConversionRate).toLocaleString('vi-VN')}đ)
          </Typography>
        </Box>
        
        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <FormLabel component="legend" sx={{ display: 'flex', alignItems: 'center' }}>
            Chọn vé để đổi bằng điểm
            <Tooltip title="Hệ thống sẽ ưu tiên đổi điểm cho vé có giá trị cao nhất" arrow>
              <InfoIcon fontSize="small" color="action" sx={{ ml: 1 }} />
            </Tooltip>
          </FormLabel>
          
          <RadioGroup
            value={pointSelectionType}
            onChange={handlePointSelectionChange}
          >
            <FormControlLabel
              value="none"
              control={<Radio />}
              label="Không sử dụng điểm"
            />

            {maxExchangeableTickets >= 1 && (
              <FormControlLabel
                value="one"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body1">
                      Đổi 1 vé ({pointsForOneTicket} điểm = {(pointsForOneTicket * pointConversionRate).toLocaleString('vi-VN')}đ)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Loại vé: {oneTicketType}
                    </Typography>
                  </Box>
                }
              />
            )}

            {maxExchangeableTickets >= 2 && (
              <FormControlLabel
                value="two"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body1">
                      Đổi 2 vé ({pointsForTwoTickets} điểm = {(pointsForTwoTickets * pointConversionRate).toLocaleString('vi-VN')}đ)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Loại vé: {twoTicketTypesString}
                    </Typography>
                  </Box>
                }
              />
            )}

            {maxExchangeableTickets >= 3 && (
              <FormControlLabel
                value="all"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body1">
                      Đổi tất cả {maxExchangeableTickets} vé ({pointsForAllTickets} điểm = {(pointsForAllTickets * pointConversionRate).toLocaleString('vi-VN')}đ)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Tối đa số vé có thể đổi với điểm hiện có
                    </Typography>
                  </Box>
                }
              />
            )}
          </RadioGroup>
        </FormControl>

        {pointsToUse > 0 && (
          <Box sx={{ 
            mt: 2, 
            p: 2, 
            bgcolor: alpha('#4caf50', 0.1), 
            borderRadius: 1, 
            border: '1px solid', 
            borderColor: 'success.light' 
          }}>
            <Typography variant="body1" fontWeight="bold">
              Đã chọn sử dụng {pointsToUse} điểm, tương đương {calculatePointValue(pointsToUse).toLocaleString('vi-VN')}đ
            </Typography>
          </Box>
        )}
      </Box>
    );
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
                              mt: 2
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

                            {/* Points Usage Section */}
                            <Box sx={{ mt: 3 }}>
                              <Typography variant="h6" gutterBottom>
                                Sử dụng điểm thành viên
                              </Typography>

                              {renderPointsSelectionSection()}

                              {pointsToUse > 0 && (
                                <Paper
                                  variant="outlined"
                                  sx={{
                                    p: 2,
                                    mt: 2,
                                    bgcolor: 'background.default',
                                    borderColor: 'divider'
                                  }}
                                >
                                  <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                                    Tổng kết điểm:
                                  </Typography>

                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="error">Điểm sử dụng:</Typography>
                                    <Typography variant="body2" color="error">-{pointsToUse} điểm</Typography>
                                  </Box>

                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="success.main">Điểm tích lũy từ thanh toán tiền:</Typography>
                                    <Typography variant="body2" color="success.main">+{calculatePointsToEarn()} điểm</Typography>
                                  </Box>

                                  <Divider sx={{ my: 1 }} />

                                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body1" fontWeight="bold">
                                      Thay đổi điểm:
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      fontWeight="bold"
                                      color={calculateNetPointsChange() >= 0 ? 'success.main' : 'error'}
                                    >
                                      {calculateNetPointsChange() >= 0 ? '+' : ''}{calculateNetPointsChange()} điểm
                                    </Typography>
                                  </Box>
                                </Paper>
                              )}
                            </Box>
                          </Box>
                        ) : (
                          <Alert severity="info" sx={{ mt: 2 }}>
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

                        {selectedUser && pointsToUse > 0 && (
                          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                            <Typography variant="body1">Thanh toán bằng điểm:</Typography>
                            <Typography variant="body1" color="success.main">
                              -{calculatePointValue(pointsToUse).toLocaleString("vi-VN")}đ
                            </Typography>
                          </Box>
                        )}

                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="h6">Cần thanh toán:</Typography>
                          <Typography variant="h6" color="primary" fontWeight="bold">
                            {calculateRemainingAmount().toLocaleString("vi-VN")}đ
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