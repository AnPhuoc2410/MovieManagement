import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../apis/axios.config";
import { SeatType } from "../../types/seattype.types";
import { Box, Button, IconButton, Typography, Card, CardContent } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useTranslation } from "react-i18next";

interface TicketPriceProps {
  onNext?: (selectedSeats: SeatType[]) => void;
}

const currencyFormatMap: Record<string, { locale: string; currency: string }> = {
  en: { locale: "en-US", currency: "USD" },
  jp: { locale: "ja-JP", currency: "JPY" },
  vi: { locale: "vi-VN", currency: "VND" },
};

const exchangeRates = {
  VND: 1,
  USD: 0.000039,
  JPY: 0.0058,
};

const TicketPrice: React.FC<TicketPriceProps> = ({ onNext }) => {
  const [seatTypes, setSeatTypes] = useState<SeatType[]>([]);
  const { t, i18n } = useTranslation();
  const [currencyFormat, setCurrencyFormat] = useState({
    locale: "vi-VN",
    currency: "VND",
  });

  useEffect(() => {
    const currentLang = i18n.language;
    const languageKey = currentLang.substring(0, 2); // Get first 2 chars (e.g., "en" from "en-US")
    setCurrencyFormat(currencyFormatMap[languageKey] || currencyFormatMap.vi);
  }, [i18n.language]); // This will trigger when language changes

  useEffect(() => {
    const fetchSeatTypes = async () => {
      try {
        const response = await api.get(`seattype`);
        const seatData = response.data.data.map((seat: SeatType) => ({
          ...seat,
          quantity: 0,
        }));
        setSeatTypes(seatData);
      } catch (error) {
        console.error("Error fetching seat types:", error);
      }
    };

    fetchSeatTypes();
  }, [t]);

  const increment = (id: string) => {
    setSeatTypes((prevSeats) => prevSeats.map((seat) => (seat.seatTypeId === id ? { ...seat, quantity: seat.quantity + 1 } : seat)));
  };

  const decrement = (id: string) => {
    setSeatTypes((prevSeats) => prevSeats.map((seat) => (seat.seatTypeId === id && seat.quantity > 0 ? { ...seat, quantity: seat.quantity - 1 } : seat)));
  };

  const convertPrice = (priceInVND: number, targetCurrency: string) => {
    if (targetCurrency === "VND") return priceInVND;
    return priceInVND * exchangeRates[targetCurrency as keyof typeof exchangeRates];
  };

  const formatPrice = (price: number) => {
    // Convert the VND price to the target currency
    const convertedPrice = convertPrice(price, currencyFormat.currency);

    // For JPY, round to whole number as yen doesn't use decimals
    const adjustedPrice = currencyFormat.currency === "JPY" ? Math.round(convertedPrice) : convertedPrice;

    return adjustedPrice.toLocaleString(currencyFormat.locale, {
      style: "currency",
      currency: currencyFormat.currency,
    });
  };

  const handleNext = () => {
    const selectedSeats = seatTypes.filter((seat) => seat.quantity > 0);
    if (selectedSeats.length === 0) {
      toast.error("Vui lòng chọn ít nhất một vé.");
      return;
    }
    if (onNext) onNext(selectedSeats);
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #1A1E3C 0%, #3A1155 100%)",
        color: "white",
        padding: { xs: 2, sm: 3, md: 6 },
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          textTransform: "uppercase",
          mb: { xs: 2, sm: 3, md: 4 },
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
        }}
      >
        {t("ticket_price.ticket_selection")}
      </Typography>

      <Box
        sx={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Mobile View - Vertical Layout */}
        <Box
          sx={{
            display: { xs: "flex", sm: "none" },
            flexDirection: "column",
            gap: 2,
            width: "100%",
            mb: 2,
          }}
        >
          {seatTypes.map((seat) => (
            <Card
              key={seat.seatTypeId}
              sx={{
                backgroundColor: "rgba(255,255,255,0.08)",
                color: "white",
                borderRadius: 2,
                "&:hover": {
                  transform: "scale(1.02)",
                  transition: "0.3s ease-in-out",
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  "&:last-child": { pb: 2 },
                }}
              >
                <Box sx={{ textAlign: "left" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {seat.typeName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#FFC107", fontWeight: "bold" }}>
                    {formatPrice(seat.price)}
                  </Typography>
                </Box>

                {/* Quantity Controls */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <IconButton
                    onClick={() => decrement(seat.seatTypeId)}
                    sx={{
                      color: seat.quantity > 0 ? "#FFC107" : "gray",
                      "&:hover": { color: "#FFC107" },
                      p: { xs: 1 },
                    }}
                    disabled={seat.quantity === 0}
                    size="small"
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>

                  <Typography variant="body1" sx={{ fontWeight: "bold", mx: 1, minWidth: "24px", textAlign: "center" }}>
                    {seat.quantity}
                  </Typography>

                  <IconButton
                    onClick={() => increment(seat.seatTypeId)}
                    sx={{
                      color: "white",
                      "&:hover": { color: "#FFC107" },
                      p: { xs: 1 },
                    }}
                    size="small"
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Tablet and Desktop View - Swiper */}
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            pagination={{ clickable: true }}
            breakpoints={{
              600: { slidesPerView: 2 },
              900: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 1000 }}
            loop={seatTypes.length > 3}
            modules={[Pagination]}
            style={{
              width: "100%",
              margin: "0 auto",
              paddingBottom: "20px",
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
                    p: { sm: 2, md: 3 },
                    "&:hover": {
                      transform: "scale(1.05)",
                      transition: "0.3s ease-in-out",
                    },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <CardContent
                    sx={{
                      p: { sm: 1, md: 2 },
                      "&:last-child": { pb: { sm: 1, md: 2 } },
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {seat.typeName}
                    </Typography>

                    <Typography variant="body1" sx={{ color: "#FFC107", fontWeight: "bold", mb: 1 }}>
                      {formatPrice(seat.price)}
                    </Typography>

                    {/* Quantity Controls */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: { sm: 1, md: 2 },
                      }}
                    >
                      <IconButton
                        onClick={() => decrement(seat.seatTypeId)}
                        sx={{
                          color: seat.quantity > 0 ? "#FFC107" : "gray",
                          "&:hover": { color: "#FFC107" },
                        }}
                        disabled={seat.quantity === 0}
                        size="medium"
                      >
                        <RemoveIcon />
                      </IconButton>

                      <Typography variant="h6" sx={{ fontWeight: "bold", mx: 2, minWidth: "30px" }}>
                        {seat.quantity}
                      </Typography>

                      <IconButton onClick={() => increment(seat.seatTypeId)} sx={{ color: "white", "&:hover": { color: "#FFC107" } }} size="medium">
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Box>
      {/* Next Button */}
      {onNext && (
        <Box sx={{ mt: { xs: 3, sm: 4 } }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#FFC107",
              color: "black",
              fontWeight: "bold",
              px: { xs: 3, sm: 4 },
              py: { xs: 1, sm: 1.5 },
              "&:hover": { backgroundColor: "#FFA000" },
              fontSize: { xs: "0.875rem", sm: "1rem" },
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
