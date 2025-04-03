import { Visibility, VisibilityOff } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import SaveIcon from "@mui/icons-material/Save";
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
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
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { updateUserPartial } from "../../../apis/user.apis";
import InputComponent from "../../../components/common/InputComponent";
import { useAuth } from "../../../contexts/AuthContext";
import UserDetailLayout from "../../../layouts/UserDetailLayout/UserDetailLayout";
import { UserProfile } from "../../../types/users.type";

export default function UserDetail() {
  const { userId } = useParams();
  const { userDetails } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const { t } = useTranslation();
  const [passwordError, setPasswordError] = useState("");

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profile, setProfile] = useState<UserProfile>({} as UserProfile);

  useEffect(() => {
    if (userDetails && userId === userDetails.userId) {
      setProfile({
        ...userDetails,
        birthDate: userDetails.birthDate ? format(parseISO(userDetails.birthDate), "yyyy-MM-dd") : "",
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "confirmPassword" || name === "newPassword") {
      if (name === "confirmPassword" && value !== passwords.newPassword) {
        setPasswordError("Mật khẩu không khớp");
      } else if (name === "newPassword" && value !== passwords.confirmPassword) {
        setPasswordError("Mật khẩu không khớp");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTogglePasswordVisibility = (field: keyof ShowPasswordState) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
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

  const handleUpdateProfile = async (id: string) => {
    try {
      const formattedProfile = {
        ...profile,
        birthDate: profile.birthDate ? new Date(profile.birthDate).toISOString() : null,
      };

      await updateUserPartial(id, formattedProfile);
      setSuccessMessage(t("user.profile.update_success"));
      setShowSuccess(true);
    } catch (error) {
      setSuccessMessage(t("user.profile.update_failed"));
      setShowSuccess(true);
    }
  };

  const handleCloseSnackbar = () => {
    setShowSuccess(false);
  };

  return (
    <UserDetailLayout>
      <div className="relative min-h-[300px] bg-white shadow-md rounded-lg overflow-hidden">
        {/* Background Image - now only top portion */}
        <div className="h-60 relative">
          <img
            src="https://images.unsplash.com/photo-1680783307371-749c26e0f5c3?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* White content block */}
        <div className="bg-white p-6 pt-8 relative">
          {/* Avatar positioned at the intersection */}
          <div className="absolute left-8 -top-12">
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <IconButton size="small" sx={{ bgcolor: "primary.main", color: "white" }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              }
            >
              <Avatar
                alt={profile.fullName}
                src={userDetails?.avatar || "/api/placeholder/100/100"}
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: "50%", // Ensure the avatar is perfectly circular
                  border: "4px solid transparent", // Set border transparent by default for smoother hover effect
                  backgroundColor: "white",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
                  transition: "transform 0.3s ease, box-shadow 0.3s ease", // Smooth transition for transform and shadow effects

                  // Hover effects
                  "&:hover": {
                    transform: "scale(1.05)", // Slight zoom effect on hover
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)", // Deeper shadow on hover for emphasis
                    borderColor: "#4CAF50", // Border color change on hover (you can choose any color)
                  },
                }}
              />
            </Badge>
          </div>

          {/* User data positioned in the white block */}
          <div className="ml-48">
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }} color="black">
              {profile.fullName}
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "start", alignItems: "center", gap: 2, mb: 1 }}>
              <ContactMailIcon color="primary" />
              <Typography variant="body2" sx={{ mb: 1 }} color="black">
                {profile.email}
              </Typography>
            </Box>

            {userDetails?.role === 2 || userDetails?.role === 1 ? (
              <Box
                sx={{
                  display: "inline-block",
                  bgcolor: userDetails?.role === 2 ? "error.main" : "info.main",
                  color: "primary.contrastText",
                  borderRadius: 2,
                  py: 0.5,
                  px: 2,
                  mb: 2,
                }}
              >
                <Typography variant="body2" fontWeight="medium">
                  {userDetails?.role === 2 ? t("user.profile.admin") : t("user.profile.employee")}
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "inline-block",
                  bgcolor: "primary.light",
                  color: "primary.contrastText",
                  borderRadius: 2,
                  py: 0.5,
                  px: 2,
                  mb: 2,
                }}
              >
                <Typography variant="body2" fontWeight="medium">
                  {t("user.profile.cumulative_points")}: {profile.point}
                </Typography>
              </Box>
            )}
          </div>
        </div>
      </div>

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
              <List component="nav" sx={{ width: "100%" }} disablePadding>
                <ListItem button selected={tabValue === 0} onClick={() => setTabValue(0)} sx={{ borderRadius: 1, mb: 1 }}>
                  <ListItemIcon>
                    <AccountCircleIcon color={tabValue === 0 ? "primary" : "inherit"} />
                  </ListItemIcon>
                  <ListItemText
                    primary={t("user.profile.account_info")}
                    primaryTypographyProps={{
                      fontWeight: tabValue === 0 ? "bold" : "normal",
                      color: tabValue === 0 ? "primary" : "text.secondary",
                    }}
                  />{" "}
                </ListItem>

                {userDetails?.role === 0 && (
                  <ListItem button selected={tabValue === 1} onClick={() => setTabValue(1)} sx={{ borderRadius: 1, mb: 1 }}>
                    <ListItemIcon>
                      <AccountCircleIcon color={tabValue === 1 ? "primary" : "inherit"} />
                    </ListItemIcon>
                    <ListItemText
                      primary={t("user.profile.history")}
                      primaryTypographyProps={{
                        fontWeight: tabValue === 1 ? "bold" : "normal",
                        color: tabValue === 1 ? "primary" : "text.secondary",
                      }}
                    />{" "}
                  </ListItem>
                )}

                {userDetails?.role === 0 && (
                  <ListItem button selected={tabValue === 2} onClick={() => setTabValue(2)} sx={{ borderRadius: 1, mb: 1 }}>
                    <ListItemIcon>
                      <AccountCircleIcon color={tabValue === 2 ? "primary" : "inherit"} />
                    </ListItemIcon>
                    <ListItemText
                      primary={t("user.profile.booked_tickets")}
                      primaryTypographyProps={{
                        fontWeight: tabValue === 2 ? "bold" : "normal",
                        color: tabValue === 2 ? "primary" : "text.secondary",
                      }}
                    />{" "}
                  </ListItem>
                )}

                {userDetails?.role !== 2 && (
                  <ListItem button selected={tabValue === 3} onClick={() => setTabValue(3)} sx={{ borderRadius: 1, mb: 1 }}>
                    <ListItemIcon>
                      <LockIcon color={tabValue === 3 ? "primary" : "inherit"} />
                    </ListItemIcon>
                    <ListItemText
                      primary={t("user.profile.change_password")}
                      primaryTypographyProps={{
                        fontWeight: tabValue === 3 ? "bold" : "normal",
                        color: tabValue === 3 ? "primary" : "text.secondary",
                      }}
                    />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>

          {/* Right Content */}
          <Grid item xs={12} md={9}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              {/* Tabs */}
              <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
                <Tab label={t("user.profile.account_info")} />
                {userDetails?.role === 0 && <Tab label={t("user.profile.history")} />}
                {userDetails?.role === 0 && <Tab label={t("user.profile.booked_tickets")} />}
                {userDetails?.role !== 2 && <Tab label={t("user.profile.change_password")} />}
              </Tabs>

              {/* Tab Panels */}
              {tabValue === 0 && (
                <Box sx={{ mt: 3 }}>
                  <TextField label={t("user.field.full_name")} name="fullName" value={profile.fullName} onChange={handleProfileChange} fullWidth sx={{ mb: 2 }} />
                  <TextField
                    label={t("user.field.dob")}
                    name="birthDate"
                    type="date"
                    value={profile.birthDate || ""}
                    onChange={handleProfileChange}
                    fullWidth
                    sx={{ mb: 2 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      max: format(new Date(), "yyyy-MM-dd"),
                    }}
                  />
                  <RadioGroup row name="gender" value={profile.gender} onChange={handleProfileChange} sx={{ mb: 2 }}>
                    <FormControlLabel value="0" control={<Radio />} label={t("user.field.male")} />
                    <FormControlLabel value="1" control={<Radio />} label={t("user.field.female")} />
                  </RadioGroup>
                  {/* <InputComponent label={t("user.field.email")} name="email" value={profile.email} onChange={handleProfileChange} fullWidth sx={{ mb: 2 }} inputProps={{ readOnly: true }} /> */}
                  <TextField label={t("user.field.username")} name="userName" value={profile.userName} onChange={handleProfileChange} fullWidth sx={{ mb: 2 }} />
                  <InputComponent label={t("user.field.id_card")} name="idCard" value={profile.idCard} onChange={handleProfileChange} fullWidth sx={{ mb: 2 }} inputProps={{ readOnly: true }} />
                  <TextField label={t("user.field.phone")} name="phone" value={profile.phoneNumber} onChange={handleProfileChange} fullWidth sx={{ mb: 2 }} />
                  <TextField label={t("user.field.address")} name="address" value={profile.address} onChange={handleProfileChange} fullWidth sx={{ mb: 2 }} />
                  {userDetails?.role !== 2 && (
                    <Box sx={{ textAlign: "right" }}>
                      <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={() => userDetails?.userId && handleUpdateProfile(userDetails.userId)}>
                        {t("common.button.action.update")}
                      </Button>
                    </Box>
                  )}
                </Box>
              )}

              {/* Lịch sử */}
              {userDetails?.role === 0 && tabValue === 1 && (
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
                    <TextField type="date" variant="outlined" size="small" sx={{ width: 200 }} />
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
                    <TextField type="date" variant="outlined" size="small" sx={{ width: 200 }} />
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
                    <RadioGroup row defaultValue="lichSuCongDiem" sx={{ display: "flex", flexDirection: "column" }}>
                      <FormControlLabel value="lichSuCongDiem" control={<Radio />} label="Lịch sử cộng điểm" />
                      <FormControlLabel value="lichSuDungDiem" control={<Radio />} label="Lịch sử dùng điểm" />
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
              {userDetails?.role === 0 && tabValue === 2 && (
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
                                color: ticket.status === "Đã nhận vé" ? "green" : "blue",
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

              {userDetails?.role !== 2 && tabValue === 3 && (
                <Box sx={{ mt: 3 }}>
                  <TextField
                    label="Mật khẩu mới"
                    type={showPassword.new ? "text" : "password"}
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    error={!!passwordError}
                    helperText={passwordError}
                    fullWidth
                    sx={{ mb: 2 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => handleTogglePasswordVisibility("new")}>{showPassword.new ? <Visibility /> : <VisibilityOff />}</IconButton>
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
                    error={!!passwordError} // Show error state if there's an error
                    helperText={passwordError} // Show error message
                    fullWidth
                    sx={{ mb: 2 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => handleTogglePasswordVisibility("confirm")}>{showPassword.confirm ? <Visibility /> : <VisibilityOff />}</IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Box sx={{ textAlign: "right" }}>
                    <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleUpdatePassword}>
                      Cập nhật mật khẩu
                    </Button>
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Snackbar open={showSuccess} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </UserDetailLayout>
  );
}
