namespace MovieManagement.Server.Models.DTOs
{
    public class ResponseDto
    {

        public int StatusCode { get; set; } = 500;
        public bool Success { get; set; }
        public string Message { get; set; }
        public object Data { get; set; }


    }
}
