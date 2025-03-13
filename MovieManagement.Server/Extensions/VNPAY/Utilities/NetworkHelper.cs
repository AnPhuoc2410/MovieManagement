using Microsoft.AspNetCore.Http;
using System.Net;
using System.Net.Sockets;

namespace MovieManagement.Server.Extensions.VNPAY.Utilities
{
    public class NetworkHelper
    {
        /// <summary>
        /// Lấy địa chỉ IP từ HttpContext của API Controller.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public static string GetIpAddress(HttpContext context)
        {
            var remoteIpAddress = context.Connection.RemoteIpAddress;

            if (remoteIpAddress != null)
            {
                var ipv4Address = Dns.GetHostEntry(remoteIpAddress).AddressList.FirstOrDefault(x => x.AddressFamily == AddressFamily.InterNetwork);

                return remoteIpAddress.AddressFamily == AddressFamily.InterNetworkV6 && ipv4Address != null
                    ? ipv4Address.ToString()
                    : remoteIpAddress.ToString();
            }

            throw new InvalidOperationException("Không tìm thấy địa chỉ IP");
        }
    }
}
