using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using MovieManagement.Server.Services; // Adjust namespace for service
using MovieManagement.Server.Models; // Adjust namespace for models
using System;
using MovieManagement.Server.Models.RequestModel;
using MovieManagement.Server.Services.TicketDetailServices;
using static MovieManagement.Server.Models.Enums.TicketEnum;

public class SeatInfo
{
    public string Id { get; set; }
    public string Name { get; set; }
    public byte[] Version { get; set; }
    public string TicketId { get; set; }
}

public class SeatSelectionHub : Hub
{
    private static readonly Dictionary<string, string> SeatLocks = new();

    public async Task SelectSeat(SelectedSeat seat)
    {
        if (SeatLocks.ContainsKey(seat.Id))
        {
            throw new HubException("Seat is already selected by another user.");
        }

        SeatLocks[seat.Id] = Context.ConnectionId;
        await Clients.Others.SendAsync("SeatSelected", seat);
    }

    public async Task DeselectSeat(string seatId)
    {
        if (SeatLocks.ContainsKey(seatId) && SeatLocks[seatId] == Context.ConnectionId)
        {
            SeatLocks.Remove(seatId);
            await Clients.Others.SendAsync("SeatDeselected", seatId);
        }
    }

    // ✅ NEW: Lock Seat for Payment Processing
    public async Task SetSeatPending(string seatId)
    {
        if (!SeatLocks.ContainsKey(seatId))
        {
            throw new HubException("Seat is not currently selected.");
        }

        await Clients.Others.SendAsync("SeatPending", seatId);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var seatsToRelease = SeatLocks.Where(kvp => kvp.Value == Context.ConnectionId)
                                      .Select(kvp => kvp.Key)
                                      .ToList();
        foreach (var seatId in seatsToRelease)
        {
            SeatLocks.Remove(seatId);
            await Clients.Others.SendAsync("SeatDeselected", seatId);
        }
        await base.OnDisconnectedAsync(exception);
    }
}
