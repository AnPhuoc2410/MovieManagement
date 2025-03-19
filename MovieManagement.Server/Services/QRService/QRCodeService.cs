using QRCoder;

namespace MovieManagement.Server.Services.QRService
{
    public class QRCodeService : IQRCodeService
    {
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
    }
}
