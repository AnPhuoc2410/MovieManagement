import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MenuContent from "./MenuContent";
import OptionsMenu from "./OptionsMenu";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { UserResponse } from "../../types/users.type";
import { Chip } from "@mui/material";

const drawerWidth = 240;

const getRoleLabel = (role: number) => {
  switch (role) {
    case 0:
      return "Member";
    case 1:
      return "Employee";
    case 2:
      return "Admin";
    default:
      return "Unknown";
  }
};

const getRoleColor = (role: number) => {
  switch (role) {
    case 0:
      return "default";
    case 1:
      return "info";
    case 2:
      return "success";
    default:
      return "default";
  }
};

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
  },
});

export default function SideMenu() {
  const navigate = useNavigate();
  const { userDetails } = useAuth();
  const [user, setUser] = useState<Pick<UserResponse, "email" | "fullName" | "avatar" | "role">>({
    email: "",
    fullName: "",
    avatar: "",
    role: 0,
  });

  useEffect(() => {
    if (userDetails) {
      setUser(userDetails);
    }
  }, [userDetails]);

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          mt: "calc(var(--template-frame-height, 0px) + 4px)",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          p: 1.5,
        }}
      >
        <Box
          component="img"
          src="/favicon/apple-touch-icon.png"
          alt="Eiga Logo"
          sx={{ height: 50, cursor: "pointer" }}
          onClick={() =>
            setTimeout(() => {
              navigate("/");
            }, 1000)
          }
        />
        <Typography variant="h6">Eiga Management</Typography>
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MenuContent />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Avatar
          sizes="small"
          alt="Avatar Img"
          src={
            userDetails?.avatar || "https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474081dJf/mat-troll-pho-bien-tren-facebook_040119322.png"
          }
          sx={{ width: 36, height: 36 }}
        />
        <Box
          sx={{
            mr: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 0.3,
            minWidth: 0, // Ngăn text overflow
          }}
        >
          <Typography
            variant="body2"
            noWrap
            sx={{
              fontWeight: 600,
              lineHeight: 1.4,
              color: "text.primary",
              fontSize: {
                xs: "0.85rem",
                sm: "0.9rem",
              },
            }}
          >
            {user.fullName}
          </Typography>

          <Typography
            variant="caption"
            noWrap
            sx={{
              color: "text.secondary",
              fontSize: {
                xs: "0.75rem",
                sm: "0.8rem",
              },
            }}
          >
            {user.email}
          </Typography>

          <Chip
            label={getRoleLabel(user.role)}
            size="small"
            color={getRoleColor(user.role)}
            sx={{
              mt: 0.5,
              width: "fit-content",
              fontSize: {
                xs: "0.65rem",
                sm: "0.75rem",
              },
            }}
          />
        </Box>
        <OptionsMenu userId={userDetails?.userId} />
      </Stack>
    </Drawer>
  );
}
