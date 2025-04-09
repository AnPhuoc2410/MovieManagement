using System.Globalization;
using System.Text;

namespace MovieManagement.Server.Extensions.RemoveVietnamese
{
    public class VietnameseConverter
    {
        public static string RemoveVietnameseDiacritics(string input)
        {
            if (string.IsNullOrEmpty(input)) return input;

            // Normalize chuỗi về dạng FormD (tách các dấu ra)
            string normalized = input.Normalize(NormalizationForm.FormD);

            // Lọc bỏ các ký tự không phải ký tự cơ bản Latin
            StringBuilder sb = new StringBuilder();
            foreach (char c in normalized)
            {
                UnicodeCategory uc = CharUnicodeInfo.GetUnicodeCategory(c);
                if (uc != UnicodeCategory.NonSpacingMark)
                {
                    sb.Append(c);
                }
            }

            // Chuyển lại về dạng FormC
            string result = sb.ToString().Normalize(NormalizationForm.FormC);

            // Xử lý riêng một số ký tự đặc biệt không thuộc hệ thống Unicode chuẩn (đ, Đ)
            result = result.Replace('đ', 'd').Replace('Đ', 'D');

            return result;
        }
    }
}
