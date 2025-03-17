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
    public class SeatSelectionHub : Hub
    {
        private readonly ITicketDetailService _ticketService;

        public SeatSelectionHub(ITicketDetailService ticketService)
        {
            _ticketService = ticketService;
        }

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
        public async Task SelectSeat(string seatId, string userId)
        {
            // Notify other users that this seat is selected.
            await Clients.Others.SendAsync("SeatSelected", seatId, userId);

            // Schedule a Hangfire job to auto-release the seat after 5 minutes.
            BackgroundJob.Schedule(() => AutoReleaseSeat(seatId), TimeSpan.FromMinutes(5));
        }

        /// <summary>
        /// Confirms the seat purchase by updating its status to "Bought" in the database,
        /// then notifies all clients.
        /// </summary>
        public async Task ConfirmSeatPurchase(string seatId)
        {
            // Update the ticket status to Bought.
            await _ticketService.ChangeStatusTicketDetailAsync(Guid.Parse(seatId), TicketStatus.Paid);

            // Notify all clients that the seat is now bought.
            await Clients.All.SendAsync("SeatBought", seatId);
        }

        /// <summary>
        /// Automatically releases the seat if payment is not confirmed within 5 minutes.
        /// Notifies all clients that the seat is available again.
        /// </summary>
        public async Task AutoReleaseSeat(string seatId)
        {
            await Clients.All.SendAsync("SeatAvailable", seatId);
        }
    }
}
