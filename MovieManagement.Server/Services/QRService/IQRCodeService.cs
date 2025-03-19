namespace MovieManagement.Server.Services.QRService
{
    public interface IQRCodeService
    {
        //Các hàm generate
        byte[] GenerateQRCode(string text);
        string QRCodeImageToBase64(byte[] qrCodeImage);
        Stream GenerateQRCodeStream(byte[] qrCodeImage);

        //Các hàm sử lý QR code (khi giải mã)
        string DecodeQRCode(Stream qrCodeImage);

        // Ham kiem tra QR code
        Task<bool> CheckQRCode(string qrCode);
    }
}
