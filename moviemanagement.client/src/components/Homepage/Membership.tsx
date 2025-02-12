import { Box, Button, Typography } from "@mui/material";
import React from "react";

const Membership: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundImage: "url('https://i.pinimg.com/736x/49/f9/6e/49f96e0d81fcaf0224b434a51d6ff7de.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        textAlign: "center",
        padding: 4,
        width: "100%",
        position: "relative",
      }}
    >
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
        CHƯƠNG TRÌNH THÀNH VIÊN
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
        {/* Friend Card */}
        <Box
          sx={{
            backgroundColor: "#1A1C2A",
            padding: 3,
            borderRadius: 2,
            textAlign: "center",
            maxWidth: 320,
          }}
        >
          <img
            src="https://api-website.cinestar.com.vn/media/wysiwyg/CMSPage/Member/Desktop519x282_CMember.webp"
            alt="Friend"
            style={{ width: "100%", borderRadius: 8 }}
          />
          <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
            THÀNH VIÊN FRIEND
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Thẻ Friend nhiều ưu đãi cho thành viên mới
          </Typography>
          <Button variant="contained" color="warning" sx={{ mt: 2 }}>
            TÌM HIỂU NGAY
          </Button>
        </Box>

        {/* VIP Card */}
        <Box
          sx={{
            backgroundColor: "#1A1C2A",
            padding: 3,
            borderRadius: 2,
            textAlign: "center",
            maxWidth: 320,
          }}
        >
          <img
            src="https://th.bing.com/th/id/OIP.CP-HZNN3E_pb7X5HezrMbAHaE1?rs=1&pid=ImgDetMain"
            alt="VIP"
            style={{ width: "100%", borderRadius: 8 }}
          />
          <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
            THÀNH VIÊN VIP
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Thẻ VIP mang đến sự ưu đãi độc quyền
          </Typography>
          <Button variant="contained" color="warning" sx={{ mt: 2 }}>
            TÌM HIỂU NGAY
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Membership;