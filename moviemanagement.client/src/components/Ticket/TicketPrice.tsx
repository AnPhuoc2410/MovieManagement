import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box, Button, Card, CardContent, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import api from "../../apis/axios.config";
import { useAuth } from "../../contexts/AuthContext";
import { SeatType } from "../../types/seattype.types";

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
  const [canGoNext, setCanGoNext] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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

  useEffect(() => {
    const hasSelectedSeats = seatTypes.some((seat) => seat.quantity > 0);
    setCanGoNext(hasSelectedSeats);
  }, [seatTypes]);

  const handleNext = () => {
    const selectedSeats = seatTypes.filter((seat) => seat.quantity > 0);

    console.log(`Selected Seats: ${JSON.stringify(selectedSeats, null, 2)}`);

    if (!isAuthenticated) localStorage.setItem("seatDetails", JSON.stringify(selectedSeats));

    if (onNext) onNext(selectedSeats);
  };

  // If user is not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          color: "white",
          padding: { xs: 2, sm: 3, md: 6 },
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          alignItems: "center",
          justifyContent: "center",
          minHeight: "300px",
        }}
      >
        <Typography variant="h5" sx={{ mb: 3 }}>
          {t("showtime_cinema.title.login_required")}
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          {t("showtime_cinema.title.please_login_to_continue")}
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            navigate("/auth/login", { state: { from: window.location.pathname } });
          }}
          sx={{
            backgroundColor: "#FFC107",
            color: "black",
            fontWeight: "bold",
            px: { xs: 3, sm: 4 },
            py: { xs: 1, sm: 1.5 },
            "&:hover": { backgroundColor: "#FFA000" },
          }}
        >
          {t("login")}
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        color: "white",
        padding: { xs: 2, sm: 3, md: 6 },
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
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

      <Typography
        variant="body2"
        sx={{
          mb: { xs: 2, sm: 3, md: 4 },
          fontSize: { xs: "0.875rem", sm: "1rem" },
          color: "red",
          minHeight: "24px", // Giữ chỗ cho text
          opacity: canGoNext ? 0 : 1,
          visibility: canGoNext ? "hidden" : "visible",
          transition: "opacity 0.3s ease, visibility 0.3s ease",
        }}
      >
        *Xin vui lòng chọn ít nhất một loại ghế để tiếp tục.
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
        {/* Mobile and Tablet View - Vertical Layout */}
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
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
                  <Typography variant="h6" sx={{ color: "#FFC107", fontWeight: "bold" }}>
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

        {/* Desktop View - Horizontal Row */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            width: "100%",
            overflowX: "auto",
            pb: 1,
          }}
        >
          {seatTypes.map((seat) => (
            <Card
              key={seat.seatTypeId}
              sx={{
                backgroundColor: "rgba(255,255,255,0.08)",
                color: "white",
                borderRadius: 2,
                flex: "1 0 auto",
                maxWidth: "220px",
                "&:hover": {
                  transform: "scale(1.02)",
                  transition: "0.3s ease-in-out",
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  p: 2,
                  "&:last-child": { pb: 2 },
                  height: "100%",
                }}
              >
                <Box sx={{ textAlign: "left", mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {seat.typeName}
                  </Typography>
                  <Typography variant="h5" sx={{ color: "#FFC107", fontWeight: "bold" }}>
                    {formatPrice(seat.price)}
                  </Typography>
                </Box>

                {/* Quantity Controls */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
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
      </Box>
      {/* Next Button */}
      {onNext && (
        <Box sx={{ textAlign: "center", minHeight: "48px", mt: 3 }}>
          <Button
            variant="contained"
            disabled={!canGoNext}
            sx={{
              opacity: canGoNext ? 1 : 0,
              pointerEvents: canGoNext ? "auto" : "none", // Ngăn click khi ẩn
              transition: "opacity 0.3s ease-in-out",
              margin: "0 auto",
              backgroundColor: "#FFC107",
              color: "black",
              fontWeight: "bold",
              px: { xs: 3, sm: 4 },
              py: { xs: 1, sm: 1.5, md: 2, lg: 3 },
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
