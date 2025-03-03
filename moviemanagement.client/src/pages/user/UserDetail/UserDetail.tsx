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
  MenuItem,
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
import { SampleMemberProfiles } from "../../../data/user.data";

const tickets = [
  {
    id: 1,
    movieName: "Tên phim 1",
    dateStart: "01/01/2021",
    dateEnd: "02/01/2021",
    time: "20:00",
    room: "Phòng 1",
    price: "100,000 VND",
    status: "Đợi nhận vé",
  },
  {
    id: 2,
    movieName: "Tên phim 2",
    dateStart: "01/01/2021",
    dateEnd: "02/01/2021",
    time: "20:00",
    room: "Phòng 1",
    price: "100,000 VND",
    status: "Đã nhận vé",
  },
  {
    id: 3,
    movieName: "Tên phim 3",
    dateStart: "01/01/2021",
    dateEnd: "02/01/2021",
    time: "20:00",
    room: "Phòng 1",
    price: "100,000 VND",
    status: "Đợi nhận vé",
  },
];

const history = [
  {
    NgayTao: "01/01/2021",
    TenPhim: "Tên phim 1",
    DiemCong: 10,
    DiemTru: 0,
  },
  {
    NgayTao: "01/01/2021",
    TenPhim: "Tên phim 2",
    DiemCong: 10,
    DiemTru: 0,
  },
  {
    NgayTao: "01/01/2021",
    TenPhim: "Tên phim 3",
    DiemCong: 10,
    DiemTru: 0,
  },
];

export default function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profile, setProfile] = useState({
    fullName: "",
    dob: "",
    gender: "male",
    email: "",
    idCard: "",
    phone: "",
    address: "",
    pointReward: 0,
  });

  useEffect(() => {
    if (userId && SampleMemberProfiles[Number(userId)]) {
      const userData = SampleMemberProfiles[Number(userId)];
      setProfile({
        fullName: userData.HoTen,
        dob: userData.NgaySinh,
        gender: userData.GioiTinh === 1 ? "male" : "female",
        email: userData.Email,
        idCard: userData.CMND,
        phone: userData.SoDienThoai,
        address: userData.DiaChi,
        pointReward: userData.DiemTichLuy,
      });
    }
  }, [userId]);

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

  const getCurrentUserData = () => {
    return SampleMemberProfiles[Number(userId)] || SampleMemberProfiles[0];
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
    <Container sx={{ py: 6 }}>
      <Grid container spacing={3}>
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
                src="/api/placeholder/100/100"
                sx={{ width: 100, height: 100, mb: 2 }}
              />
            </Badge>

            <Typography variant="h6" fontWeight="bold" sx={{ mt: 2, mb: 0.5 }}>
              {profile.fullName}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <CardMembershipIcon color="primary" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {getCurrentUserData().MaThanhVien}
              </Typography>
            </Box>

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
                Điểm tích lũy: {profile.pointReward}
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
                  primary="Thông tin tài khoản"
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
                  primary="Lịch sử"
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
                  primary="Vé đã đặt"
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
                  <LockIcon color={tabValue === 3 ? "primary" : "inherit"} />
                </ListItemIcon>
                <ListItemText
                  primary="Thay đổi mật khẩu"
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
                  primary="Đăng xuất"
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
              <Tab label="Thông tin tài khoản" />
              <Tab label="Lịch sử" />
              <Tab label="Vé đã đặt" />
              <Tab label="Thay đổi mật khẩu" />
            </Tabs>

            {/* Tab Panels */}
            {tabValue === 0 && (
              <Box sx={{ mt: 3 }}>
                <TextField
                  label="Họ và tên"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleProfileChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Ngày sinh"
                  name="dob"
                  value={profile.dob}
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
                    label="Nam"
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Nữ"
                  />
                </RadioGroup>
                <TextField
                  label="Email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Số CMND"
                  name="idCard"
                  value={profile.idCard}
                  onChange={handleProfileChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Số điện thoại"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Địa chỉ"
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
                    Cập nhật
                  </Button>
                </Box>
              </Box>
            )}

            {/* Lịch sử */}
            {tabValue === 1 && (
              <Box
                sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}
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
                    {history.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.NgayTao}</TableCell>
                        <TableCell>{item.TenPhim}</TableCell>
                        <TableCell>{item.DiemCong}</TableCell>
                        <TableCell>{item.DiemTru}</TableCell>
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
                    {tickets.map((ticket, index) => (
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
                              ticket.status === "Đã nhận vé" ? "green" : "blue",
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
                          onClick={() => handleTogglePasswordVisibility("old")}
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
                          onClick={() => handleTogglePasswordVisibility("new")}
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
    </Container>
  );
}
