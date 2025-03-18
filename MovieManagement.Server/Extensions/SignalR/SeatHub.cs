using Hangfire;
using Microsoft.AspNetCore.SignalR;
using MovieManagement.Server.Models.RequestModel;
using MovieManagement.Server.Services.TicketDetailServices;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using static MovieManagement.Server.Models.Enums.TicketEnum;

namespace MovieManagement.Server.Extensions.SignalR
{
    public class SeatHub : Hub
    {
        private static Dictionary<string, string> _seatJobTracker = new();
        private readonly ITicketDetailService _ticketService;

        public SeatHub(ITicketDetailService ticketService)
        {
            _ticketService = ticketService;
        }

        //Every client that connects to the hub will be added to a group with the showtimeId
        public async Task JoinShowTime(string showtimeId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, showtimeId);
        }
        //Every client that disconnects from the hub will be removed from the group with the showtimeId
        public async Task LeaveShowTime(string showTimeId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"ShowTime-{showTimeId}");
        }


        /// <summary>
        /// Sets one or more seats to pending status.
        /// The client should send a list of TicketDetailRequest objects.
        /// </summary>
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


        /// <summary>
        /// Selects a seat for a user. If the seat is not paid within 5 minutes, it will be auto-released.
        /// </summary>
        public void SelectSeat(string ticketId, string showtimeId, string userId)
        {
            // Check if there's already a job for this seat
            if (_seatJobTracker.TryGetValue(ticketId, out var existingJobId))
            {
                // Cancel the existing Hangfire job to avoid multiple timers
                BackgroundJob.Delete(existingJobId);
            }

            // Schedule a new job and store its ID
            var newJobId = BackgroundJob.Schedule(() => AutoReleaseSeat(ticketId, showtimeId), TimeSpan.FromMinutes(1));
            _seatJobTracker[ticketId] = newJobId;
        }

        public async Task ConfirmSeatPurchase(List<TicketDetailRequest> ticketRequests, string showtimeId)
        {
            foreach (var ticketRequest in ticketRequests)
            {
                await _ticketService.ChangeStatusTicketDetailAsync(ticketRequest.TicketId, TicketStatus.Paid);
                //TODO: Add BillId and Change Status to Paid
                await Clients.Group(showtimeId).SendAsync("SeatBought", ticketRequest.TicketId);
            }
        }

        public async Task AutoReleaseSeat(string ticketId, string showtimeId)
        {
            await _ticketService.ChangeStatusTicketDetailAsync(Guid.Parse(ticketId), TicketStatus.Created);
            await Clients.Group(showtimeId).SendAsync("SeatAvailable", ticketId);
        }


    }
}
