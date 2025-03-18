using Microsoft.AspNetCore.Http;
using MovieManagement.Server.Extensions.VNPAY.Models;
using MovieManagement.Server.Models.RequestModel;

namespace MovieManagement.Server.Extensions.VNPAY.Services
{
    /// <summary>
    /// Giao diện định nghĩa các phương thức cần thiết để tích hợp với hệ thống thanh toán VNPAY.
    /// Các phương thức trong giao diện này cung cấp chức năng khởi tạo tham số thanh toán, tạo URL thanh toán và thực hiện giao dịch.
    /// </summary>
    public interface IVnPayService
    {
        /// <summary>
        /// Khởi tạo các tham số cần thiết cho giao dịch thanh toán với VNPAY.
        /// Phương thức này thiết lập các tham số như mã cửa hàng, mật khẩu bảo mật, và URL callback.
        /// </summary>
        /// <param name="tmnCode">Mã cửa hàng của bạn trên VNPAY.</param>
        /// <param name="hashSecret">Mật khẩu bảo mật dùng để mã hóa và xác thực giao dịch.</param>
        /// <param name="callbackUrl">URL mà VNPAY sẽ gọi lại sau khi giao dịch hoàn tất.</param>
        /// <param name="baseUrl">URL của trang web thanh toán, mặc định sử dụng URL của môi trường Sandbox.</param>
        /// <param name="version">Phiên bản của API mà bạn đang sử dụng.</param>
        /// <param name="orderType">Loại đơn hàng.</param>
        void Initialize(
            string tmnCode,
            string hashSecret,
            string baseUrl,
            string callbackUrl,
            string version = "2.1.0",
            string orderType = "other");

        /// <summary>
        /// Tạo URL thanh toán cho giao dịch dựa trên các tham số trong yêu cầu thanh toán.
        /// </summary>
        /// <param name="request">Thông tin yêu cầu thanh toán, bao gồm các tham số như mã giao dịch, số tiền, mô tả,...</param>
        /// <param name="isTest">Chỉ định xem có phải là môi trường thử nghiệm hay không (mặc định là true).</param>
        /// <returns>URL thanh toán để chuyển hướng người dùng tới trang thanh toán của VNPAY.</returns>
        Task<string> GetPaymentUrl(PaymentRequest request, Guid userId, BillRequest billRequest);

        /// <summary>
        /// Thực hiện giao dịch thanh toán và trả về kết quả.
        /// Phương thức này được gọi khi nhận được thông tin callback từ VNPAY.
        /// </summary>
        /// <param name="collections">Thông tin các tham số trả về từ VNPAY qua callback.</param>
        /// <returns></returns>
        PaymentResult GetPaymentResult(IQueryCollection parameters);

        //void HandleSuccessfulPayment(PaymentResult paymentResult);
    }
}
