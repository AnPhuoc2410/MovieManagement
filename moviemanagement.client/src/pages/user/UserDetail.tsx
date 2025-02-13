import React, { useState } from "react";
import {
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Card,
} from "@mui/material";

export default function UserDetail() {
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
  });

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-6">
      <Card className="p-4 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Thông tin đăng nhập</h2>
        <TextField
          fullWidth
          label="Member card"
          value="TV0000001"
          disabled
          className="mb-4"
        />
        <TextField
          fullWidth
          label="Tài khoản"
          value="nvtlong"
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

      <Card className="p-4 w-full max-w-md">
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
  );
}
