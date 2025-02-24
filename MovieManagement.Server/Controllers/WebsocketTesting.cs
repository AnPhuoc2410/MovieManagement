using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.WebSockets;
using System.Text;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WebsocketTesting : ControllerBase
    {

        [HttpGet("Connect")]
        public async Task Connect()
        {
            if (HttpContext.WebSockets.IsWebSocketRequest)
            {
                using WebSocket webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
                HandleWebSocketAsync(webSocket);
            }
            else
            {
                HttpContext.Response.StatusCode = 400;
            }

        }


        private async Task HandleWebSocketAsync(WebSocket webSocket)
        {
            var buffer = new byte[1024 * 4];

            WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

            while (!result.CloseStatus.HasValue)
            {
                string receivedMessage = Encoding.UTF8.GetString(buffer, 0, result.Count);
                Console.WriteLine($"Received: {receivedMessage}");

                string responseMessage = $"Server: {receivedMessage.ToUpper()}";
                byte[] messageBytes = Encoding.UTF8.GetBytes(responseMessage);

                await webSocket.SendAsync(new ArraySegment<byte>(messageBytes, 0, messageBytes.Length),
                    result.MessageType, result.EndOfMessage, CancellationToken.None);

                result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            }

            await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
        }


        //Javascript example of using the current testing Websocket (Cause i didn't make the real function yet).
        //REMEMBER TO CHANGE THE URL.

        /*

        const socket = new WebSocket("ws://localhost:5000/api/websocket/connect");

        socket.onopen = () => {
            console.log("Connected to WebSocket");
            socket.send("Hello Server!");
        };

        socket.onmessage = (event) => {
            console.log("Message from server: " + event.data);
        };

        socket.onclose = (event) => {
            console.log("WebSocket closed:", event);
        };


        */


    }
}
