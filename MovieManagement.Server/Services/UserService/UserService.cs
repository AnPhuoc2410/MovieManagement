using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.RequestModel;
using MovieManagement.Server.Services.JwtService;
using MovieManagement.Server.Models.ResponseModel;
using static MovieManagement.Server.Models.Enums.UserEnum;
using MovieManagement.Server.Services.BillService;
using static MovieManagement.Server.Models.Enums.BillEnum;
using static MovieManagement.Server.Models.Enums.TicketEnum;

namespace MovieManagement.Server.Services.UserService
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public UserService(IUnitOfWork unitOfWork, IMapper mapper, IBillService billService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task ChangeUserPasswordByUserId(Guid userId, string currentPassword, string newPassword)
        {
            if(userId == Guid.Empty)
                throw new BadRequestException("Id cannot be empty!");
            if(string.IsNullOrEmpty(currentPassword))
                throw new BadRequestException("Current password cannot be empty!");
            if (string.IsNullOrEmpty(newPassword))
                throw new BadRequestException("New password cannot be empty!");
                //Checking userId is existing
                var user = await _unitOfWork.UserRepository.GetByIdAsync(userId);
            if (user == null)
                throw new NotFoundException("User not found!");

            //Checking new password is blank
            if (string.IsNullOrEmpty(newPassword))
                throw new Exception("New password is blank!");
            Console.WriteLine($"Stored Hashed Password: {user.Password}");
            Console.WriteLine($"Input Password: {currentPassword}");
            //Create PasswordHasher
            var passwordHasher = new PasswordHasher<User>();

            //Verify password
            var verificationResult =
                new PasswordHasher<User>().VerifyHashedPassword(user, user.Password,
                    currentPassword);
            Console.WriteLine($"Verification Result: {verificationResult}");
            if (verificationResult == PasswordVerificationResult.Failed)
                throw new Exception("Current password is incorrect.");

            //Hash new password
            user.Password = passwordHasher.HashPassword(user, newPassword);

            //Update new password
            var updatedUser =
                await _unitOfWork.UserRepository.ResetUserPasswordByUserIdAsync(userId,
                    user.Password, newPassword);
            if (updatedUser == null)
                throw new Exception("Failed to change password.");
        }

        public Task<IEnumerable<UserDto.UserResponse>> GetAllUsersAsync()
        {
            var users = _unitOfWork.UserRepository.GetAll();
            if(users == null)
                throw new NotFoundException("Users not found!");
            return Task.FromResult(_mapper.Map<IEnumerable<UserDto.UserResponse>>(users));
        }

        public async Task<bool> RegisterWithGoogle(OAuthRequest account)
        {
            if (await _unitOfWork.UserRepository.IsExistingEmailAsync(account.Email))
                throw new Exception("Email already exists.");
            var newUser = _mapper.Map<User>(account);
            newUser.UserId = Guid.NewGuid();
            newUser.JoinDate = DateTime.Now;
            var createdUser = await _unitOfWork.UserRepository.CreateAsync(newUser);
            if (createdUser == null)
                throw new Exception("Failed to create user.");
            return true;
        }

        public async Task<bool> DeleteUserAsync(Guid id)
        {
            if(id == Guid.Empty)
                throw new BadRequestException("Id cannot be empty!");
            var user = await GetUserByIdAsync(id);
            if (user == null)
                throw new NotFoundException("User not found!");

            if (user.Role != Role.Employee)
                throw new BadRequestException("Cannot delete this user role");

            if (user.Status == UserStatus.Inactive)
                throw new BadRequestException("User is already inactive!");

            return await _unitOfWork.UserRepository.SoftDeleteAsync(id);
        }

        public async Task<UserDto.UserResponse> GetUserByIdAsync(Guid id)
        {
            if (id == Guid.Empty)
                throw new BadRequestException("Id cannot be empty!");
            var user = await _unitOfWork.UserRepository.GetByIdAsync(id) ??
                       throw new BadRequestException("User not found hihi!");
            return _mapper.Map<UserDto.UserResponse>(user);
        }

        public async Task<List<UserDto.UserResponse>> GetUserByRoleAsync(Role role)
        {
            var usersList = await _unitOfWork.UserRepository.GetUserByRoleAsync(role);
            if (usersList == null)
                throw new NotFoundException("Users not found!");

            return _mapper.Map<List<UserDto.UserResponse>>(usersList);
        }

        public async Task<UserDto.UserResponse> FindUserByPhone(string phone)
        {
            if(string.IsNullOrEmpty(phone))
                throw new BadRequestException("Phone number cannot be empty!");
            var user = await _unitOfWork.UserRepository.GetUserByPhoneAsync(phone);
            if(user == null)
                throw new NotFoundException("User not found!");
            return _mapper.Map<UserDto.UserResponse>(user);
        }

        public async Task<UserDto.UserResponse> FindUserByIdCard(string idCard)
        {
            if(string.IsNullOrEmpty(idCard))
                throw new BadRequestException("ID card cannot be empty!");
            var user = await _unitOfWork.UserRepository.GetUserByIdCardAsync(idCard);
            if(user == null)
                throw new NotFoundException("User not found!");
            return _mapper.Map<UserDto.UserResponse>(user);
        }

        public async Task<IEnumerable<UserDto.UserResponse>> GetUserPageAsync(int page, int pageSize)
        {
            if(page < 0 || pageSize < 1)
                throw new BadRequestException("Page and PageSize is invalid");
            var users = await _unitOfWork.UserRepository.GetPageAsync(page, pageSize) ??
                        throw new NotFoundException("User not found!");
            return _mapper.Map<List<UserDto.UserResponse>>(users);
        }

        public async Task UpdateUserAsync(Guid id, UserDto.UpdateRequest userDto)
        {
            if(id == Guid.Empty)
                throw new BadRequestException("Id cannot be empty!");
            var existingUser = await _unitOfWork.UserRepository.GetByIdAsync(id)
                               ?? throw new NotFoundException($"User with ID {id} not found!");

            // Check for uniqueness on each field separately
            if (userDto.UserName != null && userDto.UserName != existingUser.UserName)
            {
                bool isUsernameDuplicate = _unitOfWork.UserRepository.IsFieldExisting(
                    "UserName", userDto.UserName, excludeUserId: id);
                if (isUsernameDuplicate)
                    throw new BadRequestException("Username already exists.");
            }

            if (userDto.PhoneNumber != null && userDto.PhoneNumber != existingUser.PhoneNumber)
            {
                bool isPhoneDuplicate = _unitOfWork.UserRepository.IsFieldExisting(
                    "PhoneNumber", userDto.PhoneNumber, excludeUserId: id);
                if (isPhoneDuplicate)
                    throw new BadRequestException("Phone number already exists.");
            }

            // Map and update the user
            _mapper.Map(userDto, existingUser);
            await _unitOfWork.UserRepository.UpdateAsync(existingUser);
        }


        public async Task<bool> ExchangeTickets(Guid userId, BillRequest billRequest)
        {

            if (!billRequest.Amount.HasValue)
                throw new BadRequestException("Amount cannot be empty!");

            if (!billRequest.UsedPoint.HasValue)
                throw new BadRequestException("Used point cannot be empty!");

            if (!billRequest.TotalTicket.HasValue)
                throw new BadRequestException("Total ticket cannot be empty!");

            var user = await _unitOfWork.UserRepository.GetByIdAsync(userId) 
                ?? throw new NotFoundException("User not found!");

            if (user.Point < billRequest.UsedPoint)
                throw new BadRequestException("Not enough point to exchange ticket!");

            var pointBill = new Bill
            {
                BillId = Guid.NewGuid(),
                UserId = userId,
                Amount = billRequest.Amount.Value,
                PaymentId = null,
                Status = BillStatus.Paid,
                CreatedDate = DateTime.Now,
                Point = billRequest.UsedPoint.Value,
            };

            var moneyBill = new Bill
            {
                BillId = Guid.NewGuid(),
                UserId = userId,
                PaymentId = null,
                Status = BillStatus.Paid,
                CreatedDate = DateTime.Now,
            };


            foreach (var ticket in billRequest.Tickets)
            {
                var purchasedTicket = await _unitOfWork.TicketDetailRepository.GetTicketInfo(ticket) 
                    ?? throw new NotFoundException("Ticket not found!");
                var exchangePoint = purchasedTicket.Seat.SeatType.Price/100;
                if (exchangePoint < user.Point)
                {
                    user.Point -= exchangePoint;
                    purchasedTicket.Status = TicketStatus.Paid;
                    purchasedTicket.BillId = pointBill.BillId;
                }
                else
                {
                    moneyBill.Amount += purchasedTicket.Seat.SeatType.Price;
                    purchasedTicket.Status = TicketStatus.Paid;
                    purchasedTicket.BillId = moneyBill.BillId;
                    moneyBill.TotalTicket++;
                    moneyBill.Point += exchangePoint / 10;
                    user.Point += exchangePoint / 10;
                }

                _unitOfWork.TicketDetailRepository.PrepareUpdate(purchasedTicket);

            }

            _unitOfWork.BillRepository.PrepareCreate(pointBill);
            if (moneyBill.TotalTicket > 0)
                _unitOfWork.BillRepository.PrepareCreate(moneyBill);
            _unitOfWork.UserRepository.PrepareUpdate(user);

            var checker = await _unitOfWork.CompleteAsync();

            return checker > 0;

        }

    }
}