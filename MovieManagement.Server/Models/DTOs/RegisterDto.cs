namespace MovieManagement.Server.Models.DTOs
{
    public class RegisterDto
    {
        public string UserName{ get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public DateTime BirthDate { get; set; }
        public int Gendder { get; set; }
        public string Address { get; set; }

    }
}
