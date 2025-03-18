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

        //TODO: Using GROUP to manage the seats for each Room

        /// <summary>
        /// Sets one or more seats to pending status.
        /// The client should send a list of TicketDetailRequest objects.
        /// </summary>
        public async Task SetSeatPending(List<TicketDetailRequest> ticketRequests)
        {
            try
            {
                var responses = await _ticketService.UpdateTicketToPending(ticketRequests);
                foreach (var ticketResponse in responses)
                {
                    // Broadcast to all clients that this seat is now pending.
                    await Clients.All.SendAsync("SeatPending", ticketResponse.SeatId);
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
        public void SelectSeat(string ticketId, string userId)
        {
            // Check if there's already a job for this seat
            if (_seatJobTracker.TryGetValue(ticketId, out var existingJobId))
            {
                // Cancel the existing Hangfire job to avoid multiple timers
                BackgroundJob.Delete(existingJobId);
            }

            // Schedule a new job and store its ID
            var newJobId = BackgroundJob.Schedule(() => AutoReleaseSeat(ticketId), TimeSpan.FromMinutes(1));
            _seatJobTracker[ticketId] = newJobId;
        }

        /// <summary>
        /// Confirms the seat purchase by updating its status to "Bought" in the database,
        /// then notifies all clients.
        /// </summary>
        public async Task ConfirmSeatPurchase(List<TicketDetailRequest> ticketRequests)
        {
            // Update the ticket status to Bought.
            foreach (var ticketRequest in ticketRequests)
            {
                await _ticketService.ChangeStatusTicketDetailAsync(ticketRequest.TicketId, TicketStatus.Paid);
                // Notify all clients that the seat is now bought.
                await Clients.All.SendAsync("SeatBought", ticketRequest.TicketId);
            }
            
        }

        /// <summary>
        /// Automatically releases the seat if payment is not confirmed within 5 minutes.
        /// Notifies all clients that the seat is available again.
        /// </summary>
        public async Task AutoReleaseSeat(string ticketId)
        {
            await _ticketService.ChangeStatusTicketDetailAsync(Guid.Parse(ticketId), TicketStatus.Created);

            // Notify all clients that the seat is now available
            await Clients.All.SendAsync("SeatAvailable", ticketId);
        }

    }
}
