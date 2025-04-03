import { Box, Container } from "@mui/material";
import React, { memo } from "react";
import Header from "../../components/home/Header";
import Footer from "../../components/home/Footer";

interface Props {
  children: React.ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
}

const UserDetailLayoutInner: React.FC<Props> = ({ children, hideHeader = false, hideFooter = false }) => {
  return (
    <Box
      sx={{
        position: "relative",
        "&::before": {
          content: '""',
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 30%, rgba(78, 46, 131, 0.4) 0%, rgba(78, 46, 131, 0) 50%),
                  radial-gradient(circle at 75% 15%, rgba(33, 64, 154, 0.4) 0%, rgba(33, 64, 154, 0) 50%),
                  linear-gradient(135deg, #0B0D1A 0%, #1A1E3C 50%, #3A1155 100%)`,
          zIndex: -1,
        },
      }}
    >
      {!hideHeader && <Header />}

      <div className="mt-24 p-4 sm:p-6 md:p-8 lg:p-12 text-sm sm:text-base md:text-lg lg:text-xl">{children}</div>

      {!hideFooter && <Footer />}
    </Box>
  );
};

const UserDetailLayout = memo(UserDetailLayoutInner);

export default UserDetailLayout;
