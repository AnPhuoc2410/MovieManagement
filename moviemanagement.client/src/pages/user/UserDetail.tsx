import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Card,
  Typography,
  ListItem,
  ListItemIcon,
  List,
  ListItemText,
  Avatar,
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { SampleMemberProfiles } from "../../data/user.data";
import HistoryIcon from "@mui/icons-material/History";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import CancelIcon from "@mui/icons-material/Cancel";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();

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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const getCurrentUserData = () => {
    return SampleMemberProfiles[Number(userId)] || SampleMemberProfiles[0];
  };

  return (
    <div className="flex gap-4 p-4">
      <div className="flex flex-col items-center p-4 space-y-4 w-72 shadow-lg rounded-lg bg-white h-fit">
        {/* Profile Avatar and Info */}
        <Avatar
          alt="Jackie TL"
          src="/api/placeholder/80/80"
          sx={{ width: 80, height: 80 }}
          className="mb-2"
        />
        <h2 className="text-xl font-semibold">{profile.fullName}</h2>
        <p className="text-gray-500">Điểm tích lũy: {profile.pointReward}</p>

        {/* Logout Button */}
        <Button
          variant="contained"
          color="primary"
          className="my-4"
          onClick={() => navigate("/")}
        >
          Đăng xuất
        </Button>

        {/* Navigation List */}
        <List className="w-full">
          <ListItem component="div">
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Thông tin tài khoản" />
          </ListItem>

          <ListItem component="div">
            <ListItemIcon>
              <HistoryIcon />
            </ListItemIcon>
            <ListItemText primary="Lịch sử" />
          </ListItem>

          <ListItem component="div">
            <ListItemIcon>
              <EventSeatIcon />
            </ListItemIcon>
            <ListItemText primary="Vé đã đặt" />
          </ListItem>

          <ListItem component="div">
            <ListItemIcon>
              <CancelIcon />
            </ListItemIcon>
            <ListItemText primary="Vé đã hủy" />
          </ListItem>
        </List>
      </div>

      <div className="flex-1 space-y-4">
        <Typography variant="h4" className="font-bold">
          Quản lý tài khoản
        </Typography>

        {/* Login Information Card */}
        <Card className="p-4 w-full">
          <h2 className="text-lg font-bold mb-4">Thông tin đăng nhập</h2>
          <TextField
            fullWidth
            label="Member card"
            value={getCurrentUserData().MaThanhVien}
            disabled
            className="mb-4"
          />
          <TextField
            fullWidth
            label="Tài khoản"
            value={getCurrentUserData().TaiKhoan}
            disabled
            className="mb-4"
          />
          <TextField
            fullWidth
            label="Mật khẩu cũ"
            name="oldPassword"
            value={passwords.oldPassword}
            onChange={handlePasswordChange}
            type="password"
            className="mb-4"
          />
          <TextField
            fullWidth
            label="Mật khẩu mới"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            type="password"
            className="mb-4"
          />
          <TextField
            fullWidth
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handlePasswordChange}
            type="password"
            className="mb-4"
          />
          <Button variant="contained" fullWidth>
            Đổi mật khẩu
          </Button>
        </Card>

        {/* Profile Information Card */}
        <Card className="p-4 w-full">
          <h2 className="text-lg font-bold mb-4">Thông tin tài khoản</h2>
          <TextField
            fullWidth
            label="Họ tên"
            name="fullName"
            value={profile.fullName}
            onChange={handleProfileChange}
            className="mb-4"
          />
          <TextField
            fullWidth
            label="Ngày sinh"
            name="dob"
            value={profile.dob}
            onChange={handleProfileChange}
            placeholder="dd/mm/yyyy"
            className="mb-4"
          />
          <div className="mb-4">
            <RadioGroup
              row
              name="gender"
              value={profile.gender}
              onChange={handleProfileChange}
            >
              <FormControlLabel value="male" control={<Radio />} label="Nam" />
              <FormControlLabel value="female" control={<Radio />} label="Nữ" />
            </RadioGroup>
          </div>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={profile.email}
            onChange={handleProfileChange}
            className="mb-4"
          />
          <TextField
            fullWidth
            label="CMND"
            name="idCard"
            value={profile.idCard}
            onChange={handleProfileChange}
            className="mb-4"
          />
          <TextField
            fullWidth
            label="Số điện thoại"
            name="phone"
            value={profile.phone}
            onChange={handleProfileChange}
            className="mb-4"
          />
          <TextField
            fullWidth
            label="Địa chỉ"
            name="address"
            value={profile.address}
            onChange={handleProfileChange}
            className="mb-4"
          />
          <Button variant="contained" fullWidth>
            Cập nhật
          </Button>
        </Card>
      </div>
    </div>
  );
}
