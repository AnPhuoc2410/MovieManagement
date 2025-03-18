using QRCoder;

namespace MovieManagement.Server.Extensions.QRCode
{
    public class QRCodeGenerator : IQRCodeGenerator
    {
        public byte[] GenerateQRCode(string text)
        {
            byte[] qrCodeImage = null;
            if (!string.IsNullOrEmpty(text))
            {
                using (var qrGenerator = new QRCoder.QRCodeGenerator())
                {
                    var qrCodeData = qrGenerator.CreateQrCode(text, QRCoder.QRCodeGenerator.ECCLevel.Q);
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
