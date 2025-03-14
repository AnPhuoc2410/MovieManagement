namespace MovieManagement.Server.Models.Entities
{
    public class OtpCode
    {
        public Guid otpId { get; set; }
        public string Email { get; set; }
        public string Code {  get; set; }
        public int IsUsed { get; set; }
        public DateTime ExpiredTime { get; set; }
    }
}
