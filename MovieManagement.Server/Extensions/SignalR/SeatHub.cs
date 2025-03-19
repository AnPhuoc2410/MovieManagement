using Hangfire;
using Microsoft.AspNetCore.SignalR;
using MovieManagement.Server.Models.RequestModel;
using MovieManagement.Server.Services.TicketDetailServices;
using static MovieManagement.Server.Models.Enums.TicketEnum;

namespace MovieManagement.Server.Extensions.SignalR
{
    public class SeatHub : Hub
    {
        private static Dictionary<string, string> _seatJobTracker = new();
        private readonly ITicketDetailService _ticketService;
        private readonly IHubContext<SeatHub> _hubContext;

        public SeatHub(ITicketDetailService ticketService, IHubContext<SeatHub> hubContext)
        {
            _ticketService = ticketService;
            _hubContext = hubContext;
        }

        public async Task JoinShowTime(string showtimeId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, showtimeId);
        }

        public async Task LeaveShowTime(string showtimeId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, showtimeId);
        }

        public async Task SetSeatPending(List<TicketDetailRequest> ticketRequests, string showtimeId)
        {
            try
            {
                var responses = await _ticketService.UpdateTicketToPending(ticketRequests);
                foreach (var ticketResponse in responses)
                {
                    await Clients.Group(showtimeId).SendAsync("SeatPending", ticketResponse.SeatId);
                }
            }
            catch (Exception ex)
            {
                throw new HubException($"Error setting seat pending: {ex.Message}");
            }
        }

        public void SelectSeat(string ticketId, string showtimeId, string userId)
        {
            if (_seatJobTracker.TryGetValue(ticketId, out var existingJobId))
            {
                BackgroundJob.Delete(existingJobId);
            }

            var newJobId = BackgroundJob.Schedule(() => AutoReleaseSeat(ticketId, showtimeId), TimeSpan.FromMinutes(1));
            _seatJobTracker[ticketId] = newJobId;
        }

        public async Task ConfirmSeatPurchase(List<TicketDetailRequest> ticketRequests, string showtimeId)
        {
            foreach (var ticketRequest in ticketRequests)
            {
                await _ticketService.ChangeStatusTicketDetailAsync(ticketRequest.TicketId, TicketStatus.Paid);
                await Clients.Group(showtimeId).SendAsync("SeatBought", ticketRequest.TicketId);
            }
        }

        public async Task AutoReleaseSeat(string ticketId, string showtimeId)
        {
            await _ticketService.ChangeStatusTicketDetailAsync(Guid.Parse(ticketId), TicketStatus.Created);
            Console.WriteLine($"TicketID:{ticketId}");
            // Use _hubContext instead of Clients
            await _hubContext.Clients.Group(showtimeId).SendAsync("SeatAvailable", ticketId);
        }
    }
}
