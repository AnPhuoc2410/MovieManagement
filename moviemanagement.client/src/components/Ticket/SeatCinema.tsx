import EventSeatIcon from "@mui/icons-material/EventSeat";
import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import toast from "react-hot-toast";
import api from "../../apis/axios.config";
import { TicketDetail } from "../../types/ticketdetail.types";
import { SelectedSeat } from "../../types/selectedseat.types";

interface SeatProps {
  showTimeId: string;
  selectedSeats: { id: string; name: string; version: string; ticketId: string }[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<{ id: string; name: string; version: string; ticketId: string }[]>>;
  connection: HubConnection | null;
}

const SeatCinema: React.FC<SeatProps> = ({ showTimeId, selectedSeats, setSelectedSeats, connection }) => {
  const [seats, setSeats] = useState<TicketDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!connection) return;

    // Set up event listeners
    connection.on("SeatSelected", (seatInfo: SelectedSeat) => {
      setSelectedSeats((prevSeats) => {
        if (!prevSeats.some((s) => s.id === seatInfo.id)) {
          return [...prevSeats, seatInfo];
        }
        return prevSeats;
      });
    });
    connection.on("SeatDeselected", (seatId: string) => {
      setSelectedSeats((prevSeats) => prevSeats.filter((s) => s.id !== seatId));
    });

    return () => {
      connection.off("SeatSelected");
      connection.off("SeatDeselected");
    };
  }, [connection, setSelectedSeats]);


  // Fetch ticket data based on showTimeId.
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        setLoading(true);
        const response = await api.get(`ticketdetail/getbyroomid/${showTimeId}`);
        if (response.data && response.data.data) {
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
    fetchSeats();
  }, [showTimeId]);

  // Handle seat click event
  const handleSeatClick = async (ticket: TicketDetail) => {
    if (!connection) {
      toast.error("Mất kết nối đến server!");
      return;
    }

    const seatName = `${ticket.seat.atRow}${ticket.seat.atColumn}`;
    const seatInfo: SelectedSeat = {
      id: ticket.seatId,
      name: seatName,
      version: ticket.version,
      ticketId: ticket.ticketId,
    };

    setSelectedSeats((prevSeats) => {
      const existingSeatIndex = prevSeats.findIndex((s) => s.ticketId === ticket.ticketId);
      const isSameSeat = existingSeatIndex !== -1 && prevSeats[existingSeatIndex].id === ticket.seatId;

      if (isSameSeat) {
        // Deselect seat
        connection.invoke("DeselectSeat", ticket.seatId, ticket.ticketId)
          .then(() => toast.success(`Bỏ chọn ghế ${seatName}`))
          .catch((error) => toast.error(`Hủy chọn ghế thất bại: ${error}`));

        return prevSeats.filter((s) => s.ticketId !== ticket.ticketId);
      } else {
        if (existingSeatIndex !== -1) {
          // Deselect previous seat first
          const previousSeat = prevSeats[existingSeatIndex];
          connection.invoke("DeselectSeat", previousSeat.id, ticket.ticketId)
            .catch((error) => toast.error(`Lỗi hủy ghế trước: ${error}`));

          // Replace previous seat with the new selection
          connection.invoke("SelectSeat", seatInfo)
            .then(() => toast.success(`Đổi ghế từ ${previousSeat.name} sang ${seatName}`))
            .catch((error) => toast.error(`Lỗi chọn ghế mới: ${error}`));

          return prevSeats.map((s, index) => (index === existingSeatIndex ? seatInfo : s));
        } else {
          // Select a new seat
          connection.invoke("SelectSeat", seatInfo)
            .then(() => toast.success(`Chọn ghế ${seatName}`))
            .catch((error) => toast.error(`Chọn ghế thất bại: ${error}`));

          return [...prevSeats, seatInfo];
        }
      }
    });
  };

  return (
    <Box
      sx={{
        backgroundColor: "#0B0D1A",
        color: "white",
        pb: 4,
        position: "relative",
      }}
    >
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
          Màn hình
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
                const isSelected = selectedSeats.some((s) => s.id === ticket.seatId);
                const isPending = ticket.status === 1;
                const isBought = ticket.status === 2;
                const isVip = ticket.seat.seatType.typeName === "VIP";

                let iconColor = "white";
                let backgroundColor = "transparent";
                let disabled = false;

                if (isSelected) {
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
                    sx={{
                      minWidth: "50px",
                      minHeight: "50px",
                      backgroundColor,
                      color: "white",
                      p: 0.5,
                      fontSize: "0.7rem",
                      "&:hover": {
                        backgroundColor: isSelected ? "rgba(0, 255, 0, 0.4)" : "rgba(255,255,255,0.2)",
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
