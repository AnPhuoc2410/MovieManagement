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
  useTheme
} from "@mui/material";
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

const currencyFormatMap: Record<string, { locale: string; currency: string }> =
  {
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
  const theme = useTheme();
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
        const response = await api.get(`seattype/all`);
        const seatData = response.data.data.map((seat: SeatType) => ({
          ...seat,
          quantity: 0,
        }));
        setSeatTypes(seatData);
      } catch (error) {
        console.error("Error fetching seat types:", error);
        toast.error(t("errors.fetch_seats_failed"));
      }
    };

    fetchSeatTypes();
  }, [t]);

  const increment = (id: string) => {
    setSeatTypes((prevSeats) =>
      prevSeats.map((seat) =>
        seat.seatTypeId === id
          ? { ...seat, quantity: seat.quantity + 1 }
          : seat,
      ),
    );
  };

  const decrement = (id: string) => {
    setSeatTypes((prevSeats) =>
      prevSeats.map((seat) =>
        seat.seatTypeId === id && seat.quantity > 0
          ? { ...seat, quantity: seat.quantity - 1 }
          : seat,
      ),
    );
  };

  const convertPrice = (priceInVND: number, targetCurrency: string) => {
    if (targetCurrency === "VND") return priceInVND;
    return (
      priceInVND * exchangeRates[targetCurrency as keyof typeof exchangeRates]
    );
  };

  const formatPrice = (price: number) => {
    const convertedPrice = convertPrice(price, currencyFormat.currency);
    const adjustedPrice =
      currencyFormat.currency === "JPY"
        ? Math.round(convertedPrice)
        : convertedPrice;

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
        padding: { xs: 2, sm: 3 },
        textAlign: "center",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          mb: 4,
          color: "text.primary"
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
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          pagination={{ clickable: true }}
          breakpoints={{
            600: { slidesPerView: 2 },
            900: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 1000 }}
          loop={seatTypes.length > 4}
          modules={[Pagination]}
          style={{
            width: "100%",
            margin: "0 auto",
            paddingBottom: "30px",
          }}
        >
          {seatTypes.map((seat) => (
            <SwiperSlide key={seat.seatTypeId}>
              <Card
                elevation={2}
                sx={{
                  borderRadius: 2,
                  textAlign: "center",
                  p: 2,
                  height: "100%",
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                  boxShadow: 2
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                    {t("seat")} {seat.typeName}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{ color: "primary.main", fontWeight: "bold", mb: 2 }}
                  >
                    {formatPrice(seat.price)}
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
                      color="primary"
                      disabled={seat.quantity === 0}
                      size="small"
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
                      color="primary"
                      size="small"
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
            color="primary"
            sx={{
              fontWeight: "bold",
              px: 4,
              py: 1,
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
