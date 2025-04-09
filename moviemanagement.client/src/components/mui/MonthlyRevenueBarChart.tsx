import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

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

export default function MonthlyRevenueBarChart({ data }: { data: { month: number; revenue: number }[] }) {
  const theme = useTheme();
  const colorPalette = [(theme.vars || theme).palette.primary.dark, (theme.vars || theme).palette.primary.main, (theme.vars || theme).palette.primary.light];
  const { t, i18n } = useTranslation();
  const months = data.map((item) => `${t("dashboard.month")} ${item.month}`);
  const revenues = data.map((item) => item.revenue);
  const totalRevenue = revenues.reduce((sum, revenue) => sum + revenue, 0); // Calculate total revenue

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

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {t("dashboard.year_revenue")}
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
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={[
            {
              scaleType: "band", // Use "band" for bar series
              data: months,
            },
          ]}
          series={[
            {
              id: "revenue",
              label: t("dashboard.title_revenue"),
              data: revenues,
              type: "bar", // Specify the series type as "bar"
            },
          ]}
          height={250}
          margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
