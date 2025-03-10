namespace MovieManagement.Server.Models.DTOs
{
    public class RegisterDto
    {
        public string UserName{ get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public DateTime BirthDate { get; set; }
        public int Gender { get; set; } // 0: Nam, 1: Nữ
        public string Address { get; set; }


     

    }
}
