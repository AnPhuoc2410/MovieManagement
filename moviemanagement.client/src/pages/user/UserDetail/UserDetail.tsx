import { Visibility, VisibilityOff } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import LogoutIcon from "@mui/icons-material/Logout";
import SaveIcon from "@mui/icons-material/Save";
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Radio,
  RadioGroup,
  Snackbar,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";
import { UserProfile } from "../../../types/users.type";
import Header from "../../../components/home/Header";
import Footer from "../../../components/home/Footer";
import { useTranslation } from "react-i18next";

export default function UserDetail() {
  const { userId } = useParams();
  const { userDetails } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const { t } = useTranslation();

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profile, setProfile] = useState<UserProfile>({
    fullName: "",
    birthDate: "",
    gender: 0,
    email: "",
    idCard: "",
    phoneNumber: "",
    address: "",
    point: 0,
    ticket: {
      history: [],
      data: [],
    },
  });

  useEffect(() => {
    if (userDetails && userId === userDetails.userId) {
      setProfile({
        fullName: userDetails.fullName,
        birthDate: userDetails.birthDate,
        gender: userDetails.gender,
        email: userDetails.email,
        idCard: userDetails.idCard,
        phoneNumber: userDetails.phoneNumber,
        address: userDetails.address,
        point: userDetails.point,
        ticket: {
          history: [],
          data: [],
        },
      });
    }
  }, [userDetails, userId]);

  interface ShowPasswordState {
    old: boolean;
    new: boolean;
    confirm: boolean;
  }

  interface PasswordsState {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }

  interface ProfileState {
    fullName: string;
    dob: string;
    gender: string;
    email: string;
    idCard: string;
    phone: string;
    address: string;
    pointReward: number;
  }

  interface UserData {
    HoTen: string;
    NgaySinh: string;
    GioiTinh: number;
    Email: string;
    CMND: string;
    SoDienThoai: string;
    DiaChi: string;
    DiemTichLuy: number;
    MaThanhVien: string;
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleTogglePasswordVisibility = (field: keyof ShowPasswordState) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleUpdatePassword = () => {
    // Simulating update action
    setSuccessMessage("Mật khẩu đã được cập nhật thành công!");
    setShowSuccess(true);
    setPasswords({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleUpdateProfile = () => {
    // Simulating update action
    setSuccessMessage("Thông tin tài khoản đã được cập nhật thành công!");
    setShowSuccess(true);
  };

  const handleCloseSnackbar = () => {
    setShowSuccess(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(to bottom,
        rgba(11, 13, 26, 0.95) 0%,
        rgba(11, 13, 26, 0.85) 100%
      )`,
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
      <Header />

      <Container
        maxWidth="xl"
        sx={{
          pt: { xs: "70px", sm: "80px", md: "90px" }, // Adjusted padding
          pb: { xs: 5, sm: 6, md: 8 },
          px: { xs: 2, sm: 3, md: 4 },
          position: "relative",
        }}
      >
        <Typography textAlign="center" variant="h3" sx={{ mt: 3 }}>
          {t("user.profile.my_profile")}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: { xs: 2, sm: 3, md: 4 },
            color: "white",
            position: "relative",
            minHeight: "100vh",
          }}
        >
          <Grid container spacing={3} sx={{ mt: 3 }}>
            {/* Left Sidebar */}
            <Grid item xs={12} md={3}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderRadius: 2,
                }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    <IconButton
                      size="small"
                      sx={{ bgcolor: "primary.main", color: "white" }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <Avatar
                    alt={profile.fullName}
                    src={userDetails?.avatar || "/api/placeholder/100/100"}
                    sx={{ width: 100, height: 100, mb: 2 }}
                  />
                </Badge>

                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ mt: 2, mb: 0.5 }}
                >
                  {profile.fullName}
                </Typography>

                <Box
                  sx={{
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                    borderRadius: 2,
                    py: 1,
                    px: 2,
                    mb: 3,
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    {t("user.profile.cumulative_points")}: {profile.point}
                  </Typography>
                </Box>

                <Divider sx={{ width: "100%", mb: 2 }} />

                <List component="nav" sx={{ width: "100%" }} disablePadding>
                  <ListItem
                    button
                    selected={tabValue === 0}
                    onClick={() => setTabValue(0)}
                    sx={{ borderRadius: 1, mb: 1 }}
                  >
                    <ListItemIcon>
                      <AccountCircleIcon
                        color={tabValue === 0 ? "primary" : "inherit"}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={t("user.profile.account_info")}
                      primaryTypographyProps={{
                        fontWeight: tabValue === 0 ? "bold" : "normal",
                        color: tabValue === 0 ? "primary" : "text.secondary",
                      }}
                    />{" "}
                  </ListItem>

                  <ListItem
                    button
                    selected={tabValue === 1}
                    onClick={() => setTabValue(1)}
                    sx={{ borderRadius: 1, mb: 1 }}
                  >
                    <ListItemIcon>
                      <AccountCircleIcon
                        color={tabValue === 1 ? "primary" : "inherit"}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={t("user.profile.history")}
                      primaryTypographyProps={{
                        fontWeight: tabValue === 1 ? "bold" : "normal",
                        color: tabValue === 1 ? "primary" : "text.secondary",
                      }}
                    />{" "}
                  </ListItem>

                  <ListItem
                    button
                    selected={tabValue === 2}
                    onClick={() => setTabValue(2)}
                    sx={{ borderRadius: 1, mb: 1 }}
                  >
                    <ListItemIcon>
                      <AccountCircleIcon
                        color={tabValue === 2 ? "primary" : "inherit"}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={t("user.profile.booked_tickets")}
                      primaryTypographyProps={{
                        fontWeight: tabValue === 2 ? "bold" : "normal",
                        color: tabValue === 2 ? "primary" : "text.secondary",
                      }}
                    />{" "}
                  </ListItem>

                  <ListItem
                    button
                    selected={tabValue === 3}
                    onClick={() => setTabValue(3)}
                    sx={{ borderRadius: 1, mb: 1 }}
                  >
                    <ListItemIcon>
                      <LockIcon
                        color={tabValue === 3 ? "primary" : "inherit"}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={t("user.profile.change_password")}
                      primaryTypographyProps={{
                        fontWeight: tabValue === 3 ? "bold" : "normal",
                        color: tabValue === 3 ? "primary" : "text.secondary",
                      }}
                    />
                  </ListItem>

                  <ListItem
                    button
                    onClick={() => navigate("/")}
                    sx={{ borderRadius: 1, mb: 1 }}
                  >
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={t("user.profile.logout")}
                      primaryTypographyProps={{
                        fontWeight: "bold",
                        color: "error.main",
                      }}
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            {/* Right Content */}
            <Grid item xs={12} md={9}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                {/* Tabs */}
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                >
                  <Tab label={t("user.profile.account_info")} />
                  <Tab label={t("user.profile.history")} />
                  <Tab label={t("user.profile.booked_tickets")} />
                  <Tab label={t("user.profile.change_password")} />
                </Tabs>

                {/* Tab Panels */}
                {tabValue === 0 && (
                  <Box sx={{ mt: 3 }}>
                    <TextField
                      label={t("user.field.full_name")}
                      name="fullName"
                      value={profile.fullName}
                      onChange={handleProfileChange}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label={t("user.field.dob")}
                      name="dob"
                      value={profile.birthDate}
                      onChange={handleProfileChange}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <RadioGroup
                      row
                      name="gender"
                      value={profile.gender}
                      onChange={handleProfileChange}
                      sx={{ mb: 2 }}
                    >
                      <FormControlLabel
                        value="male"
                        control={<Radio />}
                        label={t("user.field.male")}
                      />
                      <FormControlLabel
                        value="female"
                        control={<Radio />}
                        label={t("user.field.female")}
                      />
                    </RadioGroup>
                    <TextField
                      label={t("user.field.email")}
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label={t("user.field.id_card")}
                      name="idCard"
                      value={profile.idCard}
                      onChange={handleProfileChange}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label={t("user.field.phone")}
                      name="phone"
                      value={profile.phoneNumber}
                      onChange={handleProfileChange}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label={t("user.field.address")}
                      name="address"
                      value={profile.address}
                      onChange={handleProfileChange}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <Box sx={{ textAlign: "right" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={handleUpdateProfile}
                      >
                        {t("common.button.action.update")}
                      </Button>
                    </Box>
                  </Box>
                )}

                {/* Lịch sử */}
                {tabValue === 1 && (
                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h6">Từ ngày (*)</Typography>
                      <TextField
                        type="date"
                        variant="outlined"
                        size="small"
                        sx={{ width: 200 }}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h6">Đến ngày (*)</Typography>
                      <TextField
                        type="date"
                        variant="outlined"
                        size="small"
                        sx={{ width: 200 }}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        justifyContent: "center",
                        flexDirection: "column",
                        mt: 0,
                      }}
                    >
                      {/* RadioGroup for Lịch sử */}
                      <RadioGroup
                        row
                        defaultValue="lichSuCongDiem"
                        sx={{ display: "flex", flexDirection: "column" }}
                      >
                        <FormControlLabel
                          value="lichSuCongDiem"
                          control={<Radio />}
                          label="Lịch sử cộng điểm"
                        />
                        <FormControlLabel
                          value="lichSuDungDiem"
                          control={<Radio />}
                          label="Lịch sử dùng điểm"
                        />
                      </RadioGroup>
                      <Button variant="contained" color="primary">
                        Xem điểm
                      </Button>
                    </Box>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>STT</TableCell>
                          <TableCell>Ngày tạo</TableCell>
                          <TableCell>Tên phim</TableCell>
                          <TableCell>Điểm cộng</TableCell>
                          <TableCell>Điểm trừ</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {profile.ticket?.history &&
                          profile.ticket.history.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{item.dateCreate}</TableCell>
                              <TableCell>{item.movieName}</TableCell>
                              <TableCell>{item.plusPoint}</TableCell>
                              <TableCell>{item.minusPoint}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </Box>
                )}

                {/* Vé đã đặt */}
                {tabValue === 2 && (
                  <Box sx={{ mt: 3 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>STT</TableCell>
                          <TableCell>Tên phim</TableCell>
                          <TableCell>Ngày đặt</TableCell>
                          <TableCell>Ngày chiếu</TableCell>
                          <TableCell>Suất chiếu</TableCell>
                          <TableCell>Phòng chiếu</TableCell>
                          <TableCell>Giá vé</TableCell>
                          <TableCell>Trạng Thái</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {profile.ticket?.data &&
                          profile.ticket.data.map((ticket, index) => (
                            <TableRow key={ticket.id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{ticket.movieName}</TableCell>
                              <TableCell>{ticket.dateStart}</TableCell>
                              <TableCell>{ticket.dateEnd}</TableCell>
                              <TableCell>{ticket.time}</TableCell>
                              <TableCell>{ticket.room}</TableCell>
                              <TableCell>{ticket.price}</TableCell>
                              <TableCell
                                sx={{
                                  color:
                                    ticket.status === "Đã nhận vé"
                                      ? "green"
                                      : "blue",
                                }}
                              >
                                {ticket.status}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </Box>
                )}

                {tabValue === 3 && (
                  <Box sx={{ mt: 3 }}>
                    <TextField
                      label="Mật khẩu cũ"
                      type={showPassword.old ? "text" : "password"}
                      name="oldPassword"
                      value={passwords.oldPassword}
                      onChange={handlePasswordChange}
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                handleTogglePasswordVisibility("old")
                              }
                            >
                              {showPassword.old ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      label="Mật khẩu mới"
                      type={showPassword.new ? "text" : "password"}
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                handleTogglePasswordVisibility("new")
                              }
                            >
                              {showPassword.new ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      label="Xác nhận mật khẩu mới"
                      type={showPassword.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                handleTogglePasswordVisibility("confirm")
                              }
                            >
                              {showPassword.confirm ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Box sx={{ textAlign: "right" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={handleUpdatePassword}
                      >
                        Cập nhật mật khẩu
                      </Button>
                    </Box>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <Footer />

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
