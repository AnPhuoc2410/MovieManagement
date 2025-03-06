import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Button,
  SxProps,
  Theme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import toast from "react-hot-toast";


export interface TicketType {
  id: string;
  name: string;
  type: string;
  price: number;
  quantity: number;
}

interface TicketPriceProps {
  onNext?: (selectedTickets: TicketType[]) => void;
  sx?: SxProps<Theme>;
}


const TicketPrice: React.FC<TicketPriceProps> = ({ onNext, sx }) => {
  // Sample ticket data
  const initialTickets: TicketType[] = [
    {
      id: "seat_normal",
      name: "Ghế Đơn",
      type: "Đơn",
      price: 70000,
      quantity: 0,
    },
    {
      id: "seat_double",
      name: "Ghế Đôi",
      type: "Đôi",
      price: 140000,
      quantity: 0,
    },
    {
      id: "seat_vip",
      name: "Ghế VIP",
      type: "VIP",
      price: 145000,
      quantity: 0,
    },
  ];

  const [tickets, setTickets] = useState<TicketType[]>(initialTickets);
  

  const increment = (id: string) => {
    setTickets((prevTickets) => {
      const selectedTicket = prevTickets.find((ticket) => ticket.id === id);
      if (!selectedTicket) return prevTickets;
      const isOtherTypeSelected = prevTickets.some(
        (t) => t.type !== selectedTicket.type && t.quantity > 0
      );

      if (isOtherTypeSelected) {
        toast.error("Chỉ chọn 1 loại vé cùng loại!");
        return prevTickets;
      }
      return prevTickets.map((ticket) =>
        ticket.id === id ? { ...ticket, quantity: ticket.quantity + 1 } : ticket
      );
    });
  };

  const decrement = (id: string) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === id && ticket.quantity > 0
          ? { ...ticket, quantity: ticket.quantity - 1 }
          : ticket,
      ),
    );
  };

  const handleNext = () => {
    const selected = tickets.filter((t) => t.quantity > 0);
    if (onNext) onNext(selected);
  };

  return (
    <Box sx={{ mt: 6, ...sx }}>
      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          textTransform: "uppercase",
          mb: 4,
          fontWeight: "bold",
          textAlign: "center",
          color: "white",
        }}
      >
        Chọn Loại Vé
      </Typography>

      {/* Ticket Cards */}
      <Grid container spacing={3} justifyContent="center">
        {tickets.map((ticket) => (
          <Grid item xs={12} sm={6} md={4} key={ticket.id}>
            <Box
              sx={{
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 2,
                p: 3,
                backgroundColor: "rgba(255,255,255,0.05)",
                textAlign: "left",
                color: "white",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  textTransform: "uppercase",
                  fontWeight: "bold",
                }}
              >
                {ticket.name}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#FFC107",
                  textTransform: "uppercase",
                }}
              >
                {ticket.type}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 500,
                }}
              >
                {ticket.price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  width: "120px",
                  border: "2px solid #A0AEC0",
                  borderRadius: "8px",
                  backgroundColor: "#A0AEC0",
                  px: 1,
                }}
              >
                <IconButton
                  onClick={() => decrement(ticket.id)}
                  sx={{ color: "black" }} // Change icon color for contrast
                >
                  <RemoveIcon />
                </IconButton>

                <Typography
                  variant="body1"
                  sx={{ mx: 1, textAlign: "center", minWidth: "20px", color: "black" }}
                >
                  {ticket.quantity}
                </Typography>
                <IconButton
                  onClick={() => increment(ticket.id)}
                  sx={{ color: "black" }}
                >
                  <AddIcon />
                </IconButton>
              </Box>

            </Box>
          </Grid>
        ))}
      </Grid>

      {onNext && (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button variant="contained" color="primary" onClick={handleNext}>
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TicketPrice;
