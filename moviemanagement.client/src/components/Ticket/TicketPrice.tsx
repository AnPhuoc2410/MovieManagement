import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../apis/axios.config";
import { SeatType } from "../../types/seattype.types";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export interface TicketType {
  id: string;
  name: string;
  type: string;
  price: number;
  quantity: number;
}

interface TicketPriceProps {
  onNext?: (selectedSeats: SeatType[]) => void;
}

const TicketPrice: React.FC<TicketPriceProps> = ({ onNext }) => {
  const [seatTypes, setSeatTypes] = useState<SeatType[]>([]);

  useEffect(() => {
    const fetchSeatTypes = async () => {
      try {
        const response = await api.get(`seattype/all`);
        const seatData = response.data.map((seat: SeatType) => ({
          ...seat,
          quantity: 0,
        }));
        setSeatTypes(seatData);
      } catch (error) {
        console.error("Error fetching seat types:", error);
        toast.error("Lỗi lấy dữ liệu ghế.");
      }
    };

    fetchSeatTypes();
  }, []);

  const increment = (id: string) => {
    setSeatTypes((prevSeats) =>
      prevSeats.map((seat) =>
        seat.seatTypeId === id ? { ...seat, quantity: seat.quantity + 1 } : seat
      )
    );
  };

  const decrement = (id: string) => {
    setSeatTypes((prevSeats) =>
      prevSeats.map((seat) =>
        seat.seatTypeId === id && seat.quantity > 0
          ? { ...seat, quantity: seat.quantity - 1 }
          : seat
      )
    );
  };

  const handleNext = () => {
    const selectedSeats = seatTypes.filter((seat) => seat.quantity > 0);
    if (selectedSeats.length === 0) {
      toast.error("Vui lòng chọn ít nhất một ghế.");
      return;
    }
    if (onNext) onNext(selectedSeats);
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #1A1E3C 0%, #3A1155 100%)",
        color: "white",
        padding: { xs: 3, sm: 5, md: 6 },
        textAlign: "center",
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", textTransform: "uppercase", mb: 4 }}
      >
        {t("ticket_price.ticket_selection")}
      </Typography>

      <Box
        sx={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          overflow: "hidden", // Prevents Swiper from leaking outside
          position: "relative", // Ensures it's properly positioned
        }}
      >
        <Swiper
          slidesPerView={1}
          spaceBetween={50}
          pagination={{ clickable: true }}
          breakpoints={{
            600: { slidesPerView: 2 },
            900: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 1000 }}
          loop={true}
          modules={[Pagination]}
          style={{
            width: "100%",
            margin: "0 auto",
            paddingBottom: "10px",
          }}
        >
          {seatTypes.map((seat) => (
            <SwiperSlide key={seat.seatTypeId}>
              <Card
                sx={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  color: "white",
                  borderRadius: 2,
                  textAlign: "center",
                  p: 3,
                  "&:hover": {
                    transform: "scale(1.05)",
                    transition: "0.3s ease-in-out",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Ghế {seat.typeName}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{ color: "#FFC107", fontWeight: "bold", mb: 1 }}
                  >
                    {seat.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </Typography>

                  {/* Quantity Controls */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mt: 2,
                    }}
                  >
                    <IconButton
                      onClick={() => decrement(seat.seatTypeId)}
                      sx={{
                        color: seat.quantity > 0 ? "#FFC107" : "gray",
                        "&:hover": { color: "#FFC107" },
                      }}
                      disabled={seat.quantity === 0}
                    >
                      <RemoveIcon />
                    </IconButton>

                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", mx: 2, minWidth: "30px" }}
                    >
                      {seat.quantity}
                    </Typography>

                    <IconButton
                      onClick={() => increment(seat.seatTypeId)}
                      sx={{ color: "white", "&:hover": { color: "#FFC107" } }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
      {/* Next Button */}
      {onNext && (
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#FFC107",
              color: "black",
              fontWeight: "bold",
              px: 4,
              py: 1.5,
              "&:hover": { backgroundColor: "#FFA000" },
            }}
            onClick={handleNext}
          >
          {t("ticket_price.next")}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TicketPrice;
