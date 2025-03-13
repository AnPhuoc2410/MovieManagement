using System.ComponentModel;

namespace MovieManagement.Server.Extensions.VNPAY.Enums
{
    /// <summary>
    /// Ngôn ngữ hiển thị trên giao diện thanh toán VNPAY.  
    /// </summary>
    public enum DisplayLanguage
    {
        /// <summary>
        /// Giao diện hiển thị bằng Tiếng Việt.  
        /// </summary>
        [Description("vn")]
        Vietnamese,

        /// <summary>
        /// Giao diện hiển thị bằng Tiếng Anh.  
        /// </summary>
        [Description("en")]
        English
    }
}
