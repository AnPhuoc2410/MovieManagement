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
    }
}
