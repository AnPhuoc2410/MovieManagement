import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import ScrollFloat from "../shared/ScrollFloat";

const Membership: React.FC = () => {
  const { t } = useTranslation();

  const membershipData = {
    friend: {
      image: "https://api-website.cinestar.com.vn/media/wysiwyg/CMSPage/Member/Desktop519x282_CMember.webp",
      title: t("membership.friend.title"),
      description: t("membership.friend.description"),
      buttonText: t("membership.friend.button"),
    },
    vip: {
      image: "https://th.bing.com/th/id/OIP.CP-HZNN3E_pb7X5HezrMbAHaE1?rs=1&pid=ImgDetMain",
      title: t("membership.vip.title"),
      description: t("membership.vip.description"),
      buttonText: t("membership.vip.button"),
    },
  };

  const MembershipCard = ({ data, type }: { data: typeof membershipData.friend | typeof membershipData.vip; type: "friend" | "vip" }) => (
    <Box
      sx={{
        padding: 3,
        borderRadius: 2,
        textAlign: "left",
        maxWidth: 500,
      }}
    >
      <img src={data.image} alt={data.title} style={{ width: "100%", borderRadius: 8 }} />
      <Typography variant="h4" fontWeight="bold" sx={{ mt: 2 }}>
        {data.title}
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>
        {data.description}
      </Typography>
      <Button
        variant="contained"
        color={type === "friend" ? "warning" : "primary"}
        sx={{
          backgroundColor: "yellow",
          color: "black",
          width: "200px",
          mt: 2,
        }}
      >
        {data.buttonText}
      </Button>
    </Box>
  );

  return (
    <Box
      sx={{
        backgroundImage: "url('https://cinestar.com.vn/_next/image/?url=%2Fassets%2Fimages%2Fbg-cfriends.webp&w=1920&q=75')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        textAlign: "center",
        padding: 20,
        width: "100%",
        position: "relative",
      }}
    >
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
        <ScrollFloat component="div" animationDuration={1} ease="back.inOut(2)" scrollStart="center bottom+=50%" scrollEnd="bottom bottom-=40%" stagger={0.07}>
          {t("membership.title")}
        </ScrollFloat>
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 4,
          padding: 4,
          flexWrap: "wrap",
        }}
      >
        <MembershipCard data={membershipData.friend} type="friend" />
        <MembershipCard data={membershipData.vip} type="vip" />
      </Box>
    </Box>
  );
};

export default Membership;
