using System.Text.Json.Serialization;

namespace MovieManagement.Server.Data.MetaDatas
{
    public class ApiResponse<T>
    {
        [JsonPropertyName("status_code")]
        public int StatusCode { get; set; }

        [JsonPropertyName("message")]
        public string Message { get; set; }

        [JsonPropertyName("reason")]
        public string? Reason { get; set; }

        [JsonPropertyName("is_success")]
        public bool IsSuccess { get; set; }

        [JsonPropertyName("data")]
        public T? Data { get; set; }
    }
}
