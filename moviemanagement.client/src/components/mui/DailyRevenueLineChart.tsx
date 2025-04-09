import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { LineChart } from "@mui/x-charts/LineChart";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString("en-US", {
    month: "short",
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
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

export default function DailyRevenueLineChart({ data }: { data: { date: string; revenue: number }[] }) {
  const theme = useTheme();
  const dates = data.map((item) => item.date);
  const revenues = data.map((item) => item.revenue);
  const { t, i18n } = useTranslation();

  const [currencyFormat, setCurrencyFormat] = useState({
    locale: "vi-VN",
    currency: "VND",
  });

  useEffect(() => {
    const currentLang = i18n.language;
    const languageKey = currentLang.substring(0, 2); // Get first 2 chars (e.g., "en" from "en-US")
    setCurrencyFormat(currencyFormatMap[languageKey] || currencyFormatMap.vi);
  }, [i18n.language]);

  const convertPrice = (priceInVND: number, targetCurrency: string) => {
    if (targetCurrency === "VND") return priceInVND;
    return priceInVND * exchangeRates[targetCurrency as keyof typeof exchangeRates];
  };

  const formatPrice = (price: number) => {
    const convertedPrice = convertPrice(price, currencyFormat.currency);
    const adjustedPrice = currencyFormat.currency === "JPY" ? Math.round(convertedPrice) : convertedPrice;
    return adjustedPrice.toLocaleString(currencyFormat.locale, {
      style: "currency",
      currency: currencyFormat.currency,
    });
  };

  const totalRevenue = revenues.reduce((sum, revenue) => sum + revenue, 0);

  const colorPalette = [theme.palette.primary.light, theme.palette.primary.main, theme.palette.primary.dark];

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {t("dashboard.month_revenue")}
        </Typography>
        <Stack sx={{ justifyContent: "space-between" }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: "center", sm: "flex-start" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {formatPrice(totalRevenue)} {/* Display formatted total revenue */}
            </Typography>
          </Stack>
        </Stack>
        <LineChart
          colors={colorPalette}
          xAxis={[
            {
              scaleType: "point",
              data: dates,
              tickInterval: (index, i) => (i + 1) % 5 === 0,
            },
          ]}
          series={[
            {
              id: "revenue",
              label: t("dashboard.title_revenue"),
              showMark: false,
              curve: "linear",
              data: revenues,
              area: true,
            },
          ]}
          height={250}
          margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          sx={{
            "& .MuiAreaElement-series-organic": {
              fill: "url('#organic')",
            },
            "& .MuiAreaElement-series-referral": {
              fill: "url('#referral')",
            },
            "& .MuiAreaElement-series-direct": {
              fill: "url('#direct')",
            },
          }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        >
          <AreaGradient color={theme.palette.primary.dark} id="organic" />
          <AreaGradient color={theme.palette.primary.main} id="referral" />
          <AreaGradient color={theme.palette.primary.light} id="direct" />
        </LineChart>
      </CardContent>
    </Card>
  );
}
