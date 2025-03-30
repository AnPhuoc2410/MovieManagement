import EventSeatIcon from "@mui/icons-material/EventSeat";
import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../apis/axios.config";
import { TicketDetail } from "../../types/ticketdetail.types";
import { SelectedSeat } from "../../types/selectedseat.types";
import { useSignalR } from "../../contexts/SignalRContext";
import Loader from "../shared/Loading";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";


interface SeatProps {
  showTimeId: string;
  selectedSeats: SelectedSeat[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<SelectedSeat[]>>;
  groupConnected: boolean;
}

const SeatCinema: React.FC<SeatProps> = ({ showTimeId, selectedSeats, setSelectedSeats, groupConnected }) => {
  const { t } = useTranslation();
  const { connection } = useSignalR();
  const { userDetails } = useAuth();
  const [seats, setSeats] = useState<TicketDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Determine the effective showTimeId: use the prop if provided, otherwise fallback to sessionStorage.
  const effectiveShowTimeId = showTimeId || sessionStorage.getItem("currentShowTimeId") || "";

  // Listen for backend status updates (pending, bought, etc.) via SignalR.
  useEffect(() => {
    if (!connection || !groupConnected) return;

    const handleSeatPending = (seatId: string, userId: string) => {
      console.log("Seat marked as pending:", seatId);
      const currentUserId = userDetails?.userId;
      if (userId !== currentUserId) {
        setSeats((prev) =>
          prev.map((ticket) => (ticket.seatId === seatId ? { ...ticket, status: 1 } : ticket))
        );

        // Also remove this seat from our selection if we had it selected
        setSelectedSeats((prev) => {
          const selectedSeat = prev.find(seat => seat.id === seatId);
          if (selectedSeat) {
            toast.error(`Ghế ${selectedSeat.name} đã được người khác chọn.`);
            return prev.filter(seat => seat.id !== seatId);
          }
          return prev;
        });
      }
    };

    const handleSeatBought = (seatId: string) => {
      setSeats((prev) =>
        prev.map((ticket) => (ticket.seatId === seatId ? { ...ticket, status: 2 } : ticket))
      );
    };

    const handleSeatSelected = (seatId: string, userId: string) => {
      const currentUserId = userDetails?.userId;
      if (userId !== currentUserId) {
        setSeats((prev) =>
          prev.map((ticket) => (ticket.seatId === seatId ? { ...ticket, status: 1 } : ticket))
        );
      }
    };

    const handleSeatAvailable = (seatId: string) => {
      console.log("Received SeatAvailable event for:", seatId);

      setSeats((prev) =>
        prev.map((ticket) =>
          ticket.seatId === seatId ? { ...ticket, status: 0 } : ticket
        )
      );
      // Remove auto-released seats from the current selection using ticketId
      setSelectedSeats((prev) => prev.filter(seat => seat.id !== seatId));
    };


    connection.on("SeatPending", handleSeatPending);
    connection.on("SeatBought", handleSeatBought);
    connection.on("SeatSelected", handleSeatSelected);
    connection.on("SeatAvailable", handleSeatAvailable);

    return () => {
      connection.off("SeatPending", handleSeatPending);
      connection.off("SeatBought", handleSeatBought);
      connection.off("SeatSelected", handleSeatSelected);
      connection.off("SeatAvailable", handleSeatAvailable);
    };
  }, [connection, groupConnected, setSelectedSeats]);

  useEffect(() => {
    const releaseSeatsOnReturn = async () => {
      if (connection && selectedSeats.length > 0) {
        const userId = userDetails?.userId;
        const ticketRequests = selectedSeats.map((seat) => ({
          TicketId: seat.ticketId,
          Version: seat.version,
        }));

        try {
          await connection.invoke("ReleasePendingSeats", ticketRequests, effectiveShowTimeId, userId);
          setSelectedSeats([]); // Clear locally stored selections
          toast('Các ghế đã được hủy do bạn quay lại.', {
            position: "top-center",
          });
        } catch (error) {
          console.error("Error releasing seats on return:", error);
        }
      }
    };

    releaseSeatsOnReturn();
  }, [connection]);


  // Fetch ticket data by effectiveShowTimeId.
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        setLoading(true);
        const response = await api.get(`ticketdetail/getbyshowtimeid/${effectiveShowTimeId}`);
        if (response.data?.data) {
          setSeats(response.data.data);
        } else {
          toast.error("Không tìm thấy thông tin ghế.");
        }
      } catch (error) {
        toast.error("Lỗi khi tải danh sách ghế.");
      } finally {
        setLoading(false);
      }
    };
    if (effectiveShowTimeId) {
      fetchSeats();
    }
  }, [effectiveShowTimeId]);

  const handleSeatClick = async (ticket: TicketDetail) => {
    if (!connection) {
      toast.error("Mất kết nối đến server!");
      return;
    }

    // Don't allow selecting seats that are already pending or bought
    if (ticket.status === 1 || ticket.status === 2) {
      const statusText = ticket.status === 1 ? "đang được chọn" : "đã được mua";
      toast.error(`Ghế ${ticket.seat.atRow}${ticket.seat.atColumn} ${statusText} bởi người khác.`);
      return;
    }

    const seatName = `${ticket.seat.atRow}${ticket.seat.atColumn}`;
    const seatInfo: SelectedSeat = {
      id: ticket.seatId,
      name: seatName,
      version: ticket.version,
      ticketId: ticket.ticketId,
      roomName: ticket.seat.roomName,
      isMine: true,
      selectedAt: Date.now(),
    };

    try {
      const userId = userDetails?.userId;

      // Prepare the updated seats selection based on the user's action
      let updatedSeats: SelectedSeat[] = [...selectedSeats]; // Start with current selection
      const existingSeatIndex = selectedSeats.findIndex(s => s.ticketId === ticket.ticketId);

      if (existingSeatIndex !== -1) {
        if (selectedSeats[existingSeatIndex].id === ticket.seatId) {
          // User is deselecting this seat
          updatedSeats = updatedSeats.filter(s => s.ticketId !== ticket.ticketId);
        } else {
          // User is changing from one seat to another with the same ticketId
          updatedSeats[existingSeatIndex] = seatInfo;
        }
      } else {
        // User is selecting a new seat
        updatedSeats.push(seatInfo);
      }

      // Create ticket requests from the updated selection
      const ticketRequests = updatedSeats.map(seat => ({
        TicketId: seat.ticketId,
        Version: seat.version
      }));

      console.log("Selecting seat:", seatName, ticketRequests, effectiveShowTimeId, userId);

      // Send the COMPLETE updated selection to server
      await connection.invoke("SelectSeat", ticketRequests, effectiveShowTimeId, userId);

      // Update local state if server operation succeeded
      setSelectedSeats((prevSeats) => {
        const existingSeat = prevSeats.find((s) => s.ticketId === ticket.ticketId);
        if (existingSeat) {
          if (existingSeat.id === ticket.seatId) {
            toast.error(`Bỏ chọn ghế ${seatName}`);
            return prevSeats.filter((s) => s.ticketId !== ticket.ticketId);
          } else {
            toast.success(`Đổi ghế từ ${existingSeat.name} sang ${seatName}`);
            return prevSeats.map((s) =>
              s.ticketId === ticket.ticketId ? seatInfo : s
            );
          }
        } else {
          toast.success(`Chọn ghế ${seatName}`);
          return [...prevSeats, seatInfo];
        }
      });
    } catch (error) {
      toast.error("Không thể chọn ghế này. Có thể ghế đã được người khác chọn.");
      console.error("Error selecting seat:", error);
    }
  };

  if (loading) return <Loader />;

  return (
    <Box sx={{ backgroundColor: "#0B0D1A", color: "white", pb: 4, position: "relative" }}>
      {/* Screen Display */}
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Box
          sx={{
            margin: "0 auto",
            width: "80%",
            height: "70px",
            borderTop: "6px solid #fff",
            borderRadius: "50% 50% 0 0",
          }}
        />
        <Typography variant="h6" sx={{ mt: -2, color: "white" }}>
          {t("movie_seat.selection")}
        </Typography>
      </Box>

      {/* Seat Grid */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 2 }}>
        <Box sx={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: 2 }}>
          {Object.entries(
            seats.reduce((acc, ticket) => {
              if (!acc[ticket.seat.atRow]) acc[ticket.seat.atRow] = [];
              acc[ticket.seat.atRow].push(ticket);
              return acc;
            }, {} as Record<string, TicketDetail[]>)
          ).map(([row, rowSeats]) => (
            <Box key={row} sx={{ display: "flex", justifyContent: "center", gap: 4 }}>
              {rowSeats.map((ticket) => {
                const isSelectedByMe = selectedSeats.some(
                  (s) => s.id === ticket.seatId && s.isMine
                );
                const isPending = ticket.status === 1;
                const isBought = ticket.status === 2;
                const isVip = ticket.seat.seatType.typeName === "VIP";

                let iconColor = "white";
                let backgroundColor = "transparent";
                let disabled = false;

                if (isSelectedByMe) {
                  iconColor = "green";
                  backgroundColor = "rgba(0, 255, 0, 0.2)";
                } else if (isBought) {
                  iconColor = "red";
                  backgroundColor = "rgba(255, 0, 0, 0.2)";
                  disabled = true;
                } else if (isVip) {
                  iconColor = "blue";
                  backgroundColor = "rgba(0, 0, 255, 0.2)";
                } else if (isPending) {
                  iconColor = "yellow";
                  backgroundColor = "rgba(255, 255, 0, 0.2)";
                  disabled = true;
                }

                return (
                  <Button
                    key={ticket.seatId}
                    variant="outlined"
                    disabled={disabled}
                    onClick={() => handleSeatClick(ticket)}
                    data-seat-id={ticket.seatId}
                    data-status={ticket.status}
                    sx={{
                      minWidth: "50px",
                      minHeight: "50px",
                      backgroundColor,
                      color: "white",
                      p: 0.5,
                      fontSize: "0.7rem",
                      "&:hover": {
                        backgroundColor: isSelectedByMe
                          ? "rgba(0, 255, 0, 0.4)"
                          : "rgba(255,255,255,0.2)",
                      },
                      "&.Mui-disabled": {
                        backgroundColor,
                        color: "white",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <EventSeatIcon sx={{ color: iconColor }} />
                      <Typography variant="body2" align="center">
                        {ticket.seat.atRow}
                        {ticket.seat.atColumn}
                      </Typography>
                    </Box>
                  </Button>
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SeatCinema;
