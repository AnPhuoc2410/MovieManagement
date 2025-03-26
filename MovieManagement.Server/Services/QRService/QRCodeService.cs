using MovieManagement.Server.Data;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.Enums;
using MovieManagement.Server.Models.ResponseModel;
using QRCoder;
using System.Drawing;
using ZXing.Windows.Compatibility;

namespace MovieManagement.Server.Services.QRService
{
    public class QRCodeService : IQRCodeService
    {
        private readonly IUnitOfWork _unitOfWork;

        public QRCodeService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public byte[] GenerateQRCode(string text)
        {
            byte[] qrCodeImage = null;
            if (!string.IsNullOrEmpty(text))
            {
                using (var qrGenerator = new QRCodeGenerator())
                {
                    var qrCodeData = qrGenerator.CreateQrCode(text, QRCodeGenerator.ECCLevel.Q);
                    var qrCode = new BitmapByteQRCode(qrCodeData);
                    qrCodeImage = qrCode.GetGraphic(20);
                }
            }
            return qrCodeImage;
        }
        public string QRCodeImageToBase64(byte[] qrCodeImage)
        {
            return $"data:image/png;base64,{Convert.ToBase64String(qrCodeImage)}";
        }
        public Stream GenerateQRCodeStream(byte[] qrCodeImage)
        {
            return new MemoryStream(qrCodeImage);
        }

        public string DecodeQRCode(Stream qrCodeImage)
        {
            if(qrCodeImage == null)
            {
                throw new Exception("QR code image is null!");
            }
            // Chuyen doi hinh anh sang dang bitmap
            using var bitmap = new Bitmap(qrCodeImage);

            var reader = new BarcodeReader();
            var qrInformation = reader.Decode(bitmap);

            // Neu khong tim thay thong tin QR
            if (qrInformation == null)
            {
                throw new Exception("QR code not found!");
            }
            return qrInformation.Text;
        }

        public async Task<bool> CheckQRCode(string qrCode)
        {
            // Doi sang kieu Guid
            Guid.TryParse(qrCode, out Guid qrCodeGuid);

            // Kiem tra user bill
            var userBill = await _unitOfWork.BillRepository.GetByIdAsync(qrCodeGuid);

            // Check bill is completed?
            if (userBill.Status == BillEnum.BillStatus.Completed)
            {
                return false;
            }

            // Change status
            userBill.Status = BillEnum.BillStatus.Completed;

            //Get ticket detail
            List<TicketDetail> tickets = await _unitOfWork.TicketDetailRepository.GetTicketByBillIdAsync(userBill.BillId);

            foreach (var ticket in tickets)
            {
                var userTicket = await _unitOfWork.TicketDetailRepository.GetByIdAsync(ticket.TicketId);
                if (userTicket.Status == TicketEnum.TicketStatus.Received)
                    throw new Exception("Ticket was used!");
                userTicket.Status = TicketEnum.TicketStatus.Received;
                await _unitOfWork.TicketDetailRepository.UpdateAsync(ticket);
            }

            await _unitOfWork.BillRepository.UpdateAsync(userBill);

            return true;
        }
    }
}
