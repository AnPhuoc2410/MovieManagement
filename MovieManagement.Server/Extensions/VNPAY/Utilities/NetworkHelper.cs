using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using System.Net;
using System.Net.Sockets;

namespace MovieManagement.Server.Extensions.VNPAY.Utilities
{
    public class NetworkHelper
    {
        /// <summary>
        /// Lấy địa chỉ IP từ HttpContext, xử lý khi chạy trên Azure App Service hoặc Reverse Proxy.
        /// </summary>
        /// <param name="context"></param>
        /// <returns>Chuỗi địa chỉ IP của client</returns>
        public static string GetIpAddress(HttpContext context)
        {
            // Kiểm tra header X-Forwarded-For (dùng khi chạy trên Azure, Nginx, Cloudflare, v.v.)
            var forwardedHeader = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();

            if (!string.IsNullOrEmpty(forwardedHeader))
            {
                // X-Forwarded-For có thể chứa nhiều IP, lấy IP đầu tiên (IP thật của client)
                var ip = forwardedHeader.Split(',').FirstOrDefault();
                return ip?.Trim();
            }

            // Nếu không có X-Forwarded-For, lấy trực tiếp từ RemoteIpAddress
            var remoteIpAddress = context.Connection.RemoteIpAddress;

            if (remoteIpAddress == null)
            {
                throw new InvalidOperationException("Không tìm thấy địa chỉ IP");
            }

            // Nếu IP là IPv4, trả về luôn
            if (remoteIpAddress.AddressFamily == AddressFamily.InterNetwork)
            {
                return remoteIpAddress.ToString();
            }

            // Nếu IP là IPv6, kiểm tra và chuyển đổi sang IPv4 nếu cần
            if (remoteIpAddress.AddressFamily == AddressFamily.InterNetworkV6)
            {
                var ipv4Address = remoteIpAddress.IsIPv4MappedToIPv6
                    ? remoteIpAddress.MapToIPv4().ToString()
                    : Dns.GetHostEntry(remoteIpAddress).AddressList
                          .FirstOrDefault(x => x.AddressFamily == AddressFamily.InterNetwork)?.ToString();

                return ipv4Address ?? remoteIpAddress.ToString();
            }

            return remoteIpAddress.ToString();
        }
    }
}
