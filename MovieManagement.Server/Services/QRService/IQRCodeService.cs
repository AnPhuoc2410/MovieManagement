namespace MovieManagement.Server.Services.QRService
{
    public interface IQRCodeService
    {
        byte[] GenerateQRCode(string text);
        string QRCodeImageToBase64(byte[] qrCodeImage);
        Stream GenerateQRCodeStream(byte[] qrCodeImage);
    }
}
