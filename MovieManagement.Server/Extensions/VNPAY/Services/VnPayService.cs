using Microsoft.AspNetCore.Http;
using System.Globalization;
using MovieManagement.Server.Extensions.VNPAY.Enums;
using MovieManagement.Server.Extensions.VNPAY.Models;
using MovieManagement.Server.Extensions.VNPAY.Utilities;
using MovieManagement.Server.Services.BillService;
using MovieManagement.Server.Models.RequestModel;
using MovieManagement.Server.Models.Enums;
using MovieManagement.Server.Data;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Services.TicketDetailServices;
using MovieManagement.Server.Services.EmailService;

namespace MovieManagement.Server.Extensions.VNPAY.Services
{
    public class VnPayService : IVnPayService
    {
        private string _tmnCode;
        private string _hashSecret;
        private string _callbackUrl;
        private string _baseUrl;
        private string _version;
        private string _orderType;
        private readonly IBillService _billService;
        private readonly ITicketDetailService _ticketDetailService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmailService _emailService;

        public VnPayService(IBillService billService, IUnitOfWork unitOfWork, ITicketDetailService ticketDetailService, IEmailService emailService)
        {
            _billService = billService;
            _unitOfWork = unitOfWork;
            _ticketDetailService = ticketDetailService;
            _emailService = emailService;
        }

        public void Initialize(string tmnCode,
            string hashSecret,
            string baseUrl,
            string callbackUrl,
            string version = "2.1.0",
            string orderType = "other")
        {
            _tmnCode = tmnCode;
            _hashSecret = hashSecret;
            _callbackUrl = callbackUrl;
            _baseUrl = baseUrl;
            _version = version;
            _orderType = orderType;

            EnsureParametersBeforePayment();
        }

        /// <summary>
        /// Tạo URL thanh toán 
        /// </summary>
        /// <param name="request">Thông tin cần có để tạo yêu cầu</param>
        /// <returns></returns>
        public async Task<string> GetPaymentUrl(PaymentRequest request, Guid userId, BillRequest billRequest)
        {
            EnsureParametersBeforePayment();

            if (request.Money < 5000 || request.Money > 1000000000)
                throw new ArgumentException("Số tiền thanh toán phải nằm trong khoảng 5.000 (VND) đến 1.000.000.000 (VND).");

            if (string.IsNullOrEmpty(request.Description))
                throw new ArgumentException("Không được để trống mô tả giao dịch.");

            if (string.IsNullOrEmpty(request.IpAddress))
                throw new ArgumentException("Không được để trống địa chỉ IP.");

            var user = await _unitOfWork.UserRepository.GetByIdAsync(userId) ?? throw new NotFoundException("User not found.");
            request.Description += $" - {user.UserId}";

            decimal totalMoney = 0;

            string ticketIds = string.Empty;

            foreach (var id in billRequest.Tickets)
            {
                var ticket = await _unitOfWork.TicketDetailRepository.GetTicketInfo(id) 
                    ?? throw new NotFoundException("Ticket not found.");
                ticketIds += $" - {id}";
                totalMoney += ticket.Seat.SeatType.Price;
            }

            if (billRequest.PromotionId.HasValue)
            {
                var promotion = await _unitOfWork.PromotionRepository.GetByIdAsync(billRequest.PromotionId.Value)
                    ?? throw new NotFoundException("Promotion not found.");
                totalMoney -= promotion.Discount;
            }

            if (request.Money != totalMoney)
                throw new ArgumentException("Số tiền thanh toán không chính xác.");

            billRequest.Amount = totalMoney;
            billRequest.TotalTicket = billRequest.Tickets.Count;

            var bill = await _billService.CreateBillAsync(userId, billRequest, request.PaymentId);

            request.Description += $" - {bill.BillId}";
            request.Description += ticketIds;

            var helper = new PaymentHelper();
            helper.AddRequestData("vnp_Version", _version);
            helper.AddRequestData("vnp_Command", "pay");
            helper.AddRequestData("vnp_TmnCode", _tmnCode);
            helper.AddRequestData("vnp_Amount", (request.Money * 100).ToString());
            helper.AddRequestData("vnp_CreateDate", request.CreatedDate.ToString("yyyyMMddHHmmss"));
            helper.AddRequestData("vnp_CurrCode", request.Currency.ToString().ToUpper());
            helper.AddRequestData("vnp_IpAddr", request.IpAddress);
            helper.AddRequestData("vnp_Locale", EnumHelper.GetDescription(request.Language));
            helper.AddRequestData("vnp_BankCode", request.BankCode == BankCode.ANY ? string.Empty : request.BankCode.ToString());
            helper.AddRequestData("vnp_OrderInfo", request.Description.Trim());
            helper.AddRequestData("vnp_OrderType", _orderType);
            helper.AddRequestData("vnp_ReturnUrl", _callbackUrl);
            helper.AddRequestData("vnp_TxnRef", request.PaymentId.ToString());


            return helper.GetPaymentUrl(_baseUrl, _hashSecret);
        }

        /// <summary>
        /// Lấy kết quả thanh toán sau khi thực hiện giao dịch.
        /// </summary>
        /// <param name="parameters">Các tham số trong chuỗi truy vấn của <c>CallbackUrl</c></param>
        /// <returns></returns>
        public PaymentResult GetPaymentResult(IQueryCollection parameters)
        {
            var responseData = parameters
                .Where(kv => !string.IsNullOrEmpty(kv.Key) && kv.Key.StartsWith("vnp_"))
                .ToDictionary(kv => kv.Key, kv => kv.Value.ToString());

            var vnp_BankCode = responseData.GetValueOrDefault("vnp_BankCode");
            var vnp_BankTranNo = responseData.GetValueOrDefault("vnp_BankTranNo");
            var vnp_CardType = responseData.GetValueOrDefault("vnp_CardType");
            var vnp_PayDate = responseData.GetValueOrDefault("vnp_PayDate");
            var vnp_OrderInfo = responseData.GetValueOrDefault("vnp_OrderInfo");
            var vnp_TransactionNo = responseData.GetValueOrDefault("vnp_TransactionNo");
            var vnp_ResponseCode = responseData.GetValueOrDefault("vnp_ResponseCode");
            var vnp_TransactionStatus = responseData.GetValueOrDefault("vnp_TransactionStatus");
            var vnp_TxnRef = responseData.GetValueOrDefault("vnp_TxnRef");
            var vnp_SecureHash = responseData.GetValueOrDefault("vnp_SecureHash");

            if (string.IsNullOrEmpty(vnp_BankCode)
                || string.IsNullOrEmpty(vnp_OrderInfo)
                || string.IsNullOrEmpty(vnp_TransactionNo)
                || string.IsNullOrEmpty(vnp_ResponseCode)
                || string.IsNullOrEmpty(vnp_TransactionStatus)
                || string.IsNullOrEmpty(vnp_TxnRef)
                || string.IsNullOrEmpty(vnp_SecureHash))
            {
                throw new ArgumentException("Không đủ dữ liệu để xác thực giao dịch");
            }

            var helper = new PaymentHelper();
            foreach (var (key, value) in responseData)
            {
                if (!key.Equals("vnp_SecureHash"))
                {
                    helper.AddResponseData(key, value);
                }
            }

            var responseCode = (ResponseCode)sbyte.Parse(vnp_ResponseCode);
            var transactionStatusCode = (TransactionStatusCode)sbyte.Parse(vnp_TransactionStatus);

            var paymentResult = new PaymentResult
            {
                PaymentId = long.Parse(vnp_TxnRef),
                VnpayTransactionId = long.Parse(vnp_TransactionNo),
                IsSuccess = transactionStatusCode == TransactionStatusCode.Code_00 && responseCode == ResponseCode.Code_00 && helper.IsSignatureCorrect(vnp_SecureHash, _hashSecret),
                Description = vnp_OrderInfo,
                Money = helper.GetMoneyFromResponse(),
                PaymentMethod = string.IsNullOrEmpty(vnp_CardType)
                    ? "Không xác định"
                    : vnp_CardType,
                Timestamp = string.IsNullOrEmpty(vnp_PayDate)
                    ? DateTime.Now
                    : DateTime.ParseExact(vnp_PayDate, "yyyyMMddHHmmss", CultureInfo.InvariantCulture),
                TransactionStatus = new TransactionStatus
                {
                    Code = transactionStatusCode,
                    Description = EnumHelper.GetDescription(transactionStatusCode)
                },
                PaymentResponse = new PaymentResponse
                {
                    Code = responseCode,
                    Description = EnumHelper.GetDescription(responseCode)
                },
                BankingInfor = new BankingInfor
                {
                    BankCode = vnp_BankCode,
                    BankTransactionId = string.IsNullOrEmpty(vnp_BankTranNo)
                        ? "Không xác định"
                        : vnp_BankTranNo,
                }
            };

            if (paymentResult.IsSuccess)
            {
                HandleSuccessfulPayment(paymentResult);
            }
            else
            {
                HandleFailurePayment(paymentResult);
            }

            return paymentResult;
        }

        private void EnsureParametersBeforePayment()
        {
            if (string.IsNullOrEmpty(_baseUrl) || string.IsNullOrEmpty(_tmnCode) || string.IsNullOrEmpty(_hashSecret) || string.IsNullOrEmpty(_callbackUrl))
            {
                throw new ArgumentException("Không tìm thấy BaseUrl, TmnCode, HashSecret, hoặc CallbackUrl");
            }
        }

        public void HandleSuccessfulPayment(PaymentResult paymentResult)
        {
            _billService.UpdateBill(GetIndex(paymentResult.Description, 2), BillEnum.BillStatus.Completed);
            //TODO: HERE CALL TICKETSERVICE TO UPDATE TICKET BillID
            _ticketDetailService.PurchasedTicket
                (GetTickets(paymentResult.Description, 3), GetIndex(paymentResult.Description, 2), GetIndex(paymentResult.Description, 1));

            _emailService.SendEmailReportBill(GetIndex(paymentResult.Description, 2));
        }

        private Guid GetIndex(string description, int atPos)
        {
            var index = description.Split(" - ").ToList();
            if (Guid.TryParse(index[atPos], out Guid foundGuid))
            {
                return foundGuid;
            }
            return Guid.Empty;
        }

        private List<Guid> GetTickets(string description, int index)
        {
            var tickets = description.Split(" - ").Skip(index).ToList();
            List<Guid> ticketIds = new List<Guid>();
            foreach (var ticket in tickets)
            {
                if (Guid.TryParse(ticket, out Guid ticketId))
                {
                    ticketIds.Add(ticketId);
                }
            }
            return ticketIds;
        }

        public async void HandleFailurePayment(PaymentResult paymentResult)
        {
            _billService.UpdateBillAsync(GetIndex(paymentResult.Description, 3), BillEnum.BillStatus.Cancelled);
        }
    }
}
