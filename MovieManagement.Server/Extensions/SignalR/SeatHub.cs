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
                Console.WriteLine($"[ERROR] SetSeatPending failed: {ex.Message}");
            }
        }

        public void SelectSeat(List<TicketDetailRequest> ticketRequests, string showtimeId, string userId)
        {
            foreach (var ticket in ticketRequests)
            {
                string ticketKey = $"{ticket.TicketId}-{userId}";

                if (_seatJobTracker.TryGetValue(ticketKey, out var existingJobId))
                {
                    BackgroundJob.Delete(existingJobId);
                }

                var newJobId = BackgroundJob.Schedule(() => AutoReleaseSeat(ticketRequests, showtimeId), TimeSpan.FromMinutes(1));
                _seatJobTracker[ticketKey] = newJobId;
            }
        }

        public async Task ConfirmSeatPurchase(List<TicketDetailRequest> ticketRequests, string showtimeId)
        {
            try
            {
                var responses = await _ticketService.ChangeStatusTicketDetailAsync(ticketRequests, TicketStatus.Paid);
                foreach (var ticketResponse in responses)
                {
                    await _hubContext.Clients.Group(showtimeId).SendAsync("SeatBought", ticketResponse.SeatId);
                }

                // Remove auto-release jobs if seats are confirmed
                foreach (var ticket in ticketRequests)
                {
                    string ticketKey = $"{ticket.TicketId}-{Context.ConnectionId}";
                    if (_seatJobTracker.TryGetValue(ticketKey, out var jobId))
                    {
                        BackgroundJob.Delete(jobId);
                        _seatJobTracker.Remove(ticketKey);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] ConfirmSeatPurchase failed: {ex.Message}");
            }
        }

        public async Task AutoReleaseSeat(List<TicketDetailRequest> ticketRequests, string showtimeId)
        {
            try
            {
                var responses = await _ticketService.ChangeStatusTicketDetailAsync(ticketRequests, TicketStatus.Created);
                foreach (var ticketResponse in responses)
                {
                    Console.WriteLine($"[AutoRelease] TicketID: {ticketResponse.TicketId}, SeatID: {ticketResponse.SeatId}");
                    await _hubContext.Clients.Group(showtimeId).SendAsync("SeatAvailable", ticketResponse.SeatId);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] AutoReleaseSeat failed: {ex.Message}");
            }
        }
    }
}
