import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  TextField,
  InputAdornment,
  CircularProgress,
  Paper,
  Typography,
  Box,
  Avatar,
  Stack,
  Button
} from '@mui/material';
import { debounce } from 'lodash';
import toast from 'react-hot-toast';
import { UserInfo } from '../../types/users.type';
import api from '../../apis/axios.config';
import { phoneRegex } from '../../constants/regex';

interface UserSearchProps {
  totalPrice: number;
  onUserSelect: (user: UserInfo) => void;
  onUsersFound?: (users: UserInfo[]) => void;
}

const UserSearchComponent: React.FC<UserSearchProps> = ({
  totalPrice,
  onUserSelect,
  onUsersFound
}) => {
  const [userSearchInput, setUserSearchInput] = useState("");
  const [isSearchingUser, setIsSearchingUser] = useState(false);
  const [users, setUsers] = useState<UserInfo[]>([]);

  // Debounced search function
  const debouncedSearchUser = useCallback(
    debounce(async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        setUsers([]);
        onUsersFound?.([]);
        setIsSearchingUser(false);
        return;
      }

      setIsSearchingUser(true);
      try {
        // Check if user input is phone or ID card
        const isPhoneNumber = phoneRegex.test(searchTerm.replace(/\s/g, ""));
        const searchParam = isPhoneNumber ? "phone" : "idCard";

        const response = await api.get(
          `/users/find?${searchParam}=${encodeURIComponent(searchTerm)}`
        );

        const data = response.data.data;
        if (!data) {
          // No user found
          toast.error("Không tìm thấy thành viên nào");
          setUsers([]);
          onUsersFound?.([]);
          return;
        }

        // If API returns an array of users
        const searchResults = Array.isArray(data) ? data : [data];
        setUsers(searchResults);
        onUsersFound?.(searchResults);

        if (searchResults.length === 1) {
          toast.success("Tìm thấy 1 thành viên");
        } else {
          toast.success(`${searchResults.length} kết quả được tìm thấy`);
        }
      } catch (error) {
        console.error("Error searching for user:", error);
        toast.error("Lỗi khi tìm kiếm người dùng");
        onUsersFound?.([]);
      } finally {
        setIsSearchingUser(false);
      }
    }, 500),
    [] // Empty dependency array ensures the function is created only once
  );

  // Trigger debounced search whenever input changes
  useEffect(() => {
    if (userSearchInput.trim()) {
      debouncedSearchUser(userSearchInput);
    } else {
      setUsers([]);
      onUsersFound?.([]);
    }

    // Cleanup function to cancel any pending debounced calls
    return () => {
      debouncedSearchUser.cancel();
    };
  }, [userSearchInput, debouncedSearchUser]);

  const handleSelectUser = (user: UserInfo) => {
    onUserSelect(user);
    setUsers([]); // hide the search results after selection
  };

  return (
    <>
      <TextField
        label="Tìm kiếm thành viên (CMND hoặc số điện thoại)"
        variant="outlined"
        fullWidth
        value={userSearchInput}
        onChange={(e) => setUserSearchInput(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {isSearchingUser && <CircularProgress size={20} />}
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      {/* Multiple search results */}
      {users.length > 0 && (
        <Paper
          variant="outlined"
          sx={{ p: 2, maxHeight: 200, overflowY: "auto" }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Kết quả tìm kiếm:
          </Typography>
          <Stack spacing={1}>
            {users.map((user) => (
              <Box
                key={user.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1,
                  borderRadius: 1,
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Avatar
                    src={user.avatarUrl}
                    alt={user.userName}
                  >
                    {user.userName?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1">
                      {user.userName}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {user.email} • Điểm: {user.point}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleSelectUser(user)}
                >
                  Chọn
                </Button>
              </Box>
            ))}
          </Stack>
        </Paper>
      )}
    </>
  );
};

export default UserSearchComponent;
