namespace MovieManagement.Server.Models.DTOs
{
    public interface MemberPort
    {
        class MemberRequestDTO
        {
            public Guid? MemberId { get; set; }

            public string AccountName { get; set; }

            public string Password { get; set; }

            public string Avatar { get; set; }

            public DateTime JoinDate { get; set; }

            public string FullName { get; set; }

            public DateTime? BirthDate { get; set; }

            public int Gender { get; set; } // 0: Nam, 1: Nữ

            public string? IDCard { get; set; }

            public string? Email { get; set; }

            public string? PhoneNumber { get; set; }

            public string? Address { get; set; }

            public decimal? Point { get; set; }

            public int Status { get; set; } // 0: Khóa tài khoản, 1: Đã xác nhận.
        }

        class MemberResponseDTO
        {
            public Guid? MemberId { get; set; }

            public string AccountName { get; set; }

            public string Password { get; set; }

            public string Avatar { get; set; }

            public DateTime JoinDate { get; set; }

            public string FullName { get; set; }

            public DateTime? BirthDate { get; set; }

            public int Gender { get; set; } // 0: Nam, 1: Nữ

            public string? IDCard { get; set; }

            public string? Email { get; set; }

            public string? PhoneNumber { get; set; }

            public string? Address { get; set; }

            public decimal? Point { get; set; }

            public int Status { get; set; } // 0: Khóa tài khoản, 1: Đã xác nhận.
        }

    }
}
