﻿using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.RequestModel;
using MovieManagement.Server.Models.ResponseModel;

namespace MovieManagement.Server.Services.UserService
{
    public interface IUserService
    {

        Task<UserDto.UserResponse> CreateUserAsync(UserDto.CreateUser user);
        Task<bool> RegisterWithGoogle(OAuthRequest account);
        Task<UserDto.UserResponse> GetUserByIdAsync(Guid id);
        Task<IEnumerable<UserDto.UserResponse>> GetUserPageAsync(int page, int pageSize);
        Task<IEnumerable<UserDto.UserResponse>> GetAllUsersAsync();
        Task<List<UserDto.UserResponse>> GetUserByRoleAsync(Role role);
        Task<UserDto.UserResponse> UpdateUserAsync(Guid id, UserDto.UserRequest user);
        Task<bool> ChangeUserPasswordByUserId(Guid userId, string currentPassword, string newPassword);
        Task<bool> DeleteUserAsync(Guid id);
        Task<UserDto.UserResponse> ExtractTokenAsync(string token);

    }
}
