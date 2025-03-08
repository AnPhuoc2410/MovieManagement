﻿using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.UserService
{
    public interface IUserService
    {

        Task<UserDto.UserResponse> CreateUserAsync(UserDto.UserRequest user);
        Task<UserDto.UserResponse> GetUserByIdAsync(Guid id);
        Task<List<UserDto.UserResponse>> GetUserByRoleAsync(Role role);
        Task<IEnumerable<UserDto.UserResponse>> GetUserPageAsync(int page, int pageSize);
        Task<IEnumerable<UserDto.UserResponse>> GetAllUsersAsync();
        Task<UserDto.UserResponse> UpdateUserAsync(Guid id, UserDto.UserRequest user);
        Task<bool> DeleteUserAsync(Guid id);

    }
}
