namespace MovieManagement.Server.Extensions.QRCode
{
    public interface IQRCodeGenerator
    {
        byte[] GenerateQRCode(string text);
        string QRCodeImageToBase64(byte[] qrCodeImage);
        Stream GenerateQRCodeStream(byte[] qrCodeImage);
    }
}
