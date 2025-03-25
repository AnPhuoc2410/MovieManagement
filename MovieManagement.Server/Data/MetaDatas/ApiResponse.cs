using System.Text.Json.Serialization;

namespace MovieManagement.Server.Data.MetaDatas
{
    public class ApiResponse<T>
    {
        [JsonPropertyOrder(1)]
        [JsonPropertyName("message")]
        public string? Message { get; set; }

        [JsonPropertyOrder(2)]
        [JsonPropertyName("status_code")]
        public int StatusCode { get; set; } = 200;

        [JsonPropertyOrder(3)]
        [JsonPropertyName("reason")]
        public string? Reason { get; set; }

        [JsonPropertyOrder(4)]
        [JsonPropertyName("is_success")]
        public bool IsSuccess { get; set; }

        [JsonPropertyOrder(5)]
        [JsonPropertyName("data")]
        public T? Data { get; set; }
    }
}
