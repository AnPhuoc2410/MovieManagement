using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Services.JwtService;
using MovieManagement.Server.Services.PromotionService;
using MovieManagement.Server.Services.SeatService;
using MovieManagement.Server.Services.UserService;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {

        private readonly IUserService _userService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IJwtService _jwtService;
        private readonly ISeatService _seatService;

        public TestController(IUserService userService, IUnitOfWork unitOfWork, IJwtService jwtService, ISeatService seatService)
        {
            _userService = userService;
            _unitOfWork = unitOfWork;
            _jwtService = jwtService;
            _seatService = seatService;
        }

        [HttpPost("Registration")]
        public async Task<IActionResult> Registration(UserDto userDto)
        {

            var output = await _userService.CreateUserAsync(userDto);

            return Ok(output);

        }

        [HttpPost("Login")]
        public async Task<ActionResult> Login(String userName, String pass)
        {
            var userList = await _userService.GetAllUsersAsync();

            var user = userList.FirstOrDefault(x => x.UserName == userName);


            // Use PasswordHasher to verify the password
            var passwordHasher = new PasswordHasher<UserDto>();

            var result = passwordHasher.VerifyHashedPassword(user, user.Password, pass);

            if (result == PasswordVerificationResult.Failed)
            {
                return Unauthorized("Invalid username/email or password");
            }

            var token = _jwtService.GenerateToken(user.UserId.Value, user.UserName, user.Role.ToString());

            return Ok(new { message = "Login successful", token = token, user = user });

        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<ActionResult> GetAll()
        {
            return Ok(await _userService.GetAllUsersAsync());
        }

        [HttpGet]
        [Route("TestAdmin")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult> GetHello()
        {
            return Ok("Hello chat!");
        }

        [HttpPost]
        [Route("RoomCreating")]
        public async Task<ActionResult> RoomCreating(Guid SeatTypeId, RoomDto roomDto)
        {
            _seatService.CreateByRoomAsync(SeatTypeId, roomDto);
            return Ok("Every seat in the room created!");
        }


        [HttpPost]
        [Route("DataSample")]
        public async Task<ActionResult> DataSample()
        {
            //UserSampleData();
            //PromotionSampleData();
            //RoomSampleData();
            //MovieSampleData();


            return Ok("Data Sample created");
        }


        private async Task UserSampleData()
        {
            var passwordHasher = new PasswordHasher<User>();

            var user = new User
            {
                UserName = "admin",
                Password = "1",
                BirthDate = DateTime.Now,
                Address = "HCM",
                Avatar = "https://www.google.com",
                Role = 0,
                JoinDate = DateTime.Now,
                FullName = "Admin",
                Gender = 0,
                IDCard = "123456789",
                Email = "@gmai.com",
                PhoneNumber = "123456789",
                Status = 1,
            };
            user.Password = passwordHasher.HashPassword(user, user.Password);
            _unitOfWork.UserRepository.Create(user);

            var manager = new User
            {
                UserName = "manager",
                Password = "2",
                BirthDate = DateTime.Now,
                Address = "HCM",
                Avatar = "https://www.google.com",
                Role = 1,
                JoinDate = DateTime.Now,
                FullName = "Manager",
                Gender = 0,
                IDCard = "123456789",
                Email = "@gmai.com",
                PhoneNumber = "123456789",
                Status = 1,
            };
            manager.Password = passwordHasher.HashPassword(manager, manager.Password);
            _unitOfWork.UserRepository.Create(manager);

            var user1 = new User
            {
                UserName = "user1",
                Password = "3",
                BirthDate = DateTime.Now,
                Address = "HCM",
                Avatar = "https://www.google.com",
                Role = 3,
                JoinDate = DateTime.Now,
                FullName = "User1",
            };
            user1.Password = passwordHasher.HashPassword(user1, user1.Password);
            _unitOfWork.UserRepository.Create(user1);

            var user2 = new User
            {
                UserName = "user2",
                Password = "3",
                BirthDate = DateTime.Now,
                Address = "HCM",
                Avatar = "https://www.google.com",
                Role = 3,
                JoinDate = DateTime.Now,
                FullName = "User2",
            };
            user2.Password = passwordHasher.HashPassword(user2, user2.Password);
            _unitOfWork.UserRepository.Create(user2);

            var user3 = new User
            {
                UserName = "user3",
                Password = "3",
                BirthDate = DateTime.Now,
                Address = "HCM",
                Avatar = "https://www.google.com",
                Role = 3,
                JoinDate = DateTime.Now,
                FullName = "User3",
            };
            user3.Password = passwordHasher.HashPassword(user3, user3.Password);
            _unitOfWork.UserRepository.Create(user3);

            var employee = new User
            {
                UserName = "employee",
                Password = "2",
                BirthDate = DateTime.Now,
                Address = "HCM",
                Avatar = "https://www.google.com",
                Role = 2,
                JoinDate = DateTime.Now,
                FullName = "Employee",
            };
            employee.Password = passwordHasher.HashPassword(employee, employee.Password);
            _unitOfWork.UserRepository.Create(employee);

            var employee2 = new User
            {
                UserName = "employee2",
                Password = "2",
                BirthDate = DateTime.Now,
                Address = "HCM",
                Avatar = "https://www.google.com",
                Role = 2,
                JoinDate = DateTime.Now,
                FullName = "Employee2",
            };
            employee2.Password = passwordHasher.HashPassword(employee2, employee2.Password);
            _unitOfWork.UserRepository.Create(employee2);

            var employee3 = new User
            {
                UserName = "employee3",
                Password = "2",
                BirthDate = DateTime.Now,
                Address = "HCM",
                Avatar = "https://www.google.com",
                Role = 2,
                JoinDate = DateTime.Now,
                FullName = "Employee3",
            };
            employee3.Password = passwordHasher.HashPassword(employee3, employee3.Password);
            _unitOfWork.UserRepository.Create(employee3);

            var admin2 = new User
            {
                UserName = "admin2",
                Password = "1",
                BirthDate = DateTime.Now,
                Address = "HCM",
                Avatar = "https://www.google.com",
                Role = 0,
                JoinDate = DateTime.Now,
                FullName = "Admin2",
            };
            admin2.Password = passwordHasher.HashPassword(admin2, admin2.Password);
            _unitOfWork.UserRepository.Create(admin2);




        }

        private async Task PromotionSampleData()
        {
            var promotion = new Promotion
            {
                PromotionName = "Promotion 1",
                Content = "Promotion 1",
                Discount = 10,
                FromDate = DateTime.Now,
                ToDate = DateTime.Now,
                Image = "None",
            };
            _unitOfWork.PromotionRepository.Create(promotion);

            promotion = new Promotion
            {
                PromotionName = "Promotion 2",
                Content = "Promotion 2",
                Discount = 20,
                FromDate = DateTime.Now,
                ToDate = DateTime.Now,
                Image = "None",
            };
            _unitOfWork.PromotionRepository.Create(promotion);

            promotion = new Promotion
            {
                PromotionName = "Promotion 3",
                Content = "Promotion 3",
                Discount = 30,
                FromDate = DateTime.Now,
                ToDate = DateTime.Now,
                Image = "None",
            };
            _unitOfWork.PromotionRepository.Create(promotion);

            promotion = new Promotion
            {
                PromotionName = "Promotion 4",
                Content = "Promotion 4",
                Discount = 40,
                FromDate = DateTime.Now,
                ToDate = DateTime.Now,
                Image = "None",
            };
            _unitOfWork.PromotionRepository.Create(promotion);

            promotion = new Promotion
            {
                PromotionName = "Promotion 5",
                Content = "Promotion 5",
                Discount = 50,
                FromDate = DateTime.Now,
                ToDate = DateTime.Now,
                Image = "None",
            };
            _unitOfWork.PromotionRepository.Create(promotion);

            promotion = new Promotion
            {
                PromotionName = "Promotion 6",
                Content = "Promotion 6",
                Discount = 60,
                FromDate = DateTime.Now,
                ToDate = DateTime.Now,
                Image = "None",
            };
            _unitOfWork.PromotionRepository.Create(promotion);

            promotion = new Promotion
            {
                PromotionName = "Promotion 7",
                Content = "Promotion 7",
                Discount = 70,
                FromDate = DateTime.Now,
                ToDate = DateTime.Now,
                Image = "None",
            };
            _unitOfWork.PromotionRepository.Create(promotion);

            promotion = new Promotion
            {
                PromotionName = "Promotion 8",
                Content = "Promotion 8",
                Discount = 80,
                FromDate = DateTime.Now,
                ToDate = DateTime.Now,
                Image = "None",
            };
            _unitOfWork.PromotionRepository.Create(promotion);

            promotion = new Promotion
            {
                PromotionName = "Promotion 9",
                Content = "Promotion 9",
                Discount = 90,
                FromDate = DateTime.Now,
                ToDate = DateTime.Now,
                Image = "None",
            };
            _unitOfWork.PromotionRepository.Create(promotion);


        }

        private async Task RoomSampleData()
        {
            var room = new Room
            {
                RoomName = "Room 1",
                Row = 4,
                Column = 6,
            };
            room.Total = room.Row * room.Column;
            _unitOfWork.RoomRepository.Create(room);

            room = new Room
            {
                RoomName = "Room 2",
                Row = 5,
                Column = 7,
            };
            room.Total = room.Row * room.Column;
            _unitOfWork.RoomRepository.Create(room);

            room = new Room
            {
                RoomName = "Room 3",
                Row = 6,
                Column = 8,
            };
            room.Total = room.Row * room.Column;
            _unitOfWork.RoomRepository.Create(room);

            room = new Room
            {
                RoomName = "Room 4",
                Row = 7,
                Column = 9,
            };
            room.Total = room.Row * room.Column;
            _unitOfWork.RoomRepository.Create(room);

            room = new Room
            {
                RoomName = "Room 5",
                Row = 8,
                Column = 10,
            };
            room.Total = room.Row * room.Column;



        }

        private async Task MovieSampleData()
        {
            var movie = new Movie
            {
                MovieName = "Movie 1",
                Content = "Movie 1",
                Duration = 120,
                FromDate = DateTime.Now,
                ToDate = DateTime.Now.AddMonths(1),
                Trailer = "None",
                Image = "None",
                PostDate = DateTime.Now,
            };
            _unitOfWork.MovieRepository.Create(movie);

            movie = new Movie
            {
                MovieName = "Movie 2",
                Content = "Movie 2",
                Duration = 120,
                FromDate = DateTime.Now,
                ToDate = DateTime.Now.AddMonths(1),
                Trailer = "None",
                Image = "None",
                PostDate = DateTime.Now,
            };
            _unitOfWork.MovieRepository.Create(movie);

            movie = new Movie
            {
                MovieName = "Movie 3",
                Content = "Movie 3",
                Duration = 120,
                FromDate = DateTime.Now,
                ToDate = DateTime.Now.AddMonths(1),
                Trailer = "None",
                Image = "None",
                PostDate = DateTime.Now,
            };
            _unitOfWork.MovieRepository.Create(movie);

            movie = new Movie
            {
                MovieName = "Movie 4",
                Content = "Movie 4",
                Duration = 120,
                FromDate = DateTime.Now,
                ToDate = DateTime.Now.AddMonths(1),
                Trailer = "None",
                Image = "None",
                PostDate = DateTime.Now,
            };
            _unitOfWork.MovieRepository.Create(movie);

            movie = new Movie
            {
                MovieName = "Movie 5",
                Content = "Movie 5",
                Duration = 120,
                FromDate = DateTime.Now,
                ToDate = DateTime.Now.AddMonths(1),
                Trailer = "None",
                Image = "None",
                PostDate = DateTime.Now,
            };
            _unitOfWork.MovieRepository.Create(movie);

            movie = new Movie
            {
                MovieName = "Movie 6",
                Content = "Movie 6",
                Duration = 120,
                FromDate = DateTime.Now,
                ToDate = DateTime.Now.AddMonths(1),
                Trailer = "None",
                Image = "None",
                PostDate = DateTime.Now,
            };
            _unitOfWork.MovieRepository.Create(movie);
        }
    
    
    }
}
