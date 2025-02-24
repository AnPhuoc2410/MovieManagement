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

export interface TicketType {
  id: string;
  name: string;
  type: string; // e.g. "Đơn" or "Đôi"
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
      id: "adult_single",
      name: "Người Lớn",
      type: "Đơn",
      price: 70000,
      quantity: 0,
    },
    {
      id: "student_senior_single",
      name: "HSSV - Người Cao Tuổi",
      type: "Đơn",
      price: 45000,
      quantity: 0,
    },
    {
      id: "adult_double",
      name: "Người Lớn",
      type: "Đôi",
      price: 145000,
      quantity: 0,
    },
  ];

  const [tickets, setTickets] = useState<TicketType[]>(initialTickets);

  const increment = (id: string) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === id
          ? { ...ticket, quantity: ticket.quantity + 1 }
          : ticket,
      ),
    );
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
                textAlign: "left", // Left-align all text
                color: "white", // Make text white
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              {/* Ticket Name */}
              <Typography
                variant="h6"
                sx={{
                  textTransform: "uppercase",
                  fontWeight: "bold",
                }}
              >
                {ticket.name}
              </Typography>

              {/* Ticket Type (gold color) */}
              <Typography
                variant="body1"
                sx={{
                  color: "#FFC107",
                  textTransform: "uppercase",
                }}
              >
                {ticket.type}
              </Typography>

              {/* Ticket Price */}
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

              {/* Quantity Controls */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <IconButton
                  onClick={() => decrement(ticket.id)}
                  disabled={ticket.quantity === 0}
                  sx={{ color: "white" }}
                >
                  <RemoveIcon />
                </IconButton>

                <Typography
                  variant="body1"
                  sx={{ mx: 2, minWidth: "20px", textAlign: "center" }}
                >
                  {ticket.quantity}
                </Typography>

                <IconButton
                  onClick={() => increment(ticket.id)}
                  sx={{ color: "white" }}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Next Button (optional) */}
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
