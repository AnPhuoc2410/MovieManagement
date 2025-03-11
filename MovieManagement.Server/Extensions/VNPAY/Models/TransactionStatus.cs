using MovieManagement.Server.Extensions.VNPAY.Enums;

namespace MovieManagement.Server.Extensions.VNPAY.Models
{
    /// <summary>
    /// Trạng thái của giao dịch sau khi được xử lý.
    /// </summary>
    public class TransactionStatus
    {
        /// <summary>
        /// Mã trạng thái của giao dịch do VNPAY định nghĩa.
        /// </summary>
        public TransactionStatusCode Code { get; set; }

        /// <summary>
        /// Mô tả chi tiết về trạng thái giao dịch.
        /// </summary>
        public string Description { get; set; }
    }
}
