import EventSeatIcon from "@mui/icons-material/EventSeat";
import { Box, Button, Typography } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../../apis/axios.config";
import { TicketDetail } from "../../types/ticketdetail.types";
import { SelectedSeat } from "../../types/selectedseat.types";
import { useSignalR } from "../../contexts/SignalRContext";
import Loader from "../shared/Loading";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { SeatType } from "../../types/seattype.types";

// Types
interface SeatProps {
  showTimeId: string;
  selectedSeats: SelectedSeat[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<SelectedSeat[]>>;
  groupConnected: boolean;
  userTickets: SeatType[];
}

interface SeatButtonProps {
  ticket: TicketDetail;
  isSelected?: boolean;
  isSelectedByMe?: boolean;
  isPending?: boolean;
  isBought?: boolean;
  canSelect: boolean;
  seatType?: string;
  onClick?: () => void;
  handleSeatClick: (ticket: TicketDetail) => void;
}

// Utility functions - extracted outside the component
const isAdjacentSeat = (seatA: TicketDetail, seatB: TicketDetail): boolean => {
  const rowA = seatA.seat.atRow;
  const rowB = seatB.seat.atRow;
  const colA = seatA.seat.atColumn;
  const colB = seatB.seat.atColumn;

  // Case 1: Same row, adjacent columns (horizontal adjacency)
  if (rowA === rowB && Math.abs(colA - colB) === 1) {
    return true;
  }

  // Case 2: Same column, adjacent rows (vertical adjacency)
  // Convert row letters to numbers (A=1, B=2, etc.) to check adjacency
  const rowANum = rowA.charCodeAt(0);
  const rowBNum = rowB.charCodeAt(0);
  if (colA === colB && Math.abs(rowANum - rowBNum) === 1) {
    return true;
  }

  return false;
};

const areSeatsConnected = (seats: TicketDetail[]): boolean => {
  if (seats.length <= 1) return true;

  const visited = new Set<string>();

  const dfs = (seat: TicketDetail) => {
    const seatKey = `${seat.seat.atRow}${seat.seat.atColumn}`;
    visited.add(seatKey);

    for (const otherSeat of seats) {
      const otherSeatKey = `${otherSeat.seat.atRow}${otherSeat.seat.atColumn}`;
      if (visited.has(otherSeatKey)) continue;

      if (isAdjacentSeat(seat, otherSeat)) {
        dfs(otherSeat);
      }
    }
  };

  dfs(seats[0]);

  return visited.size === seats.length;
};

// Check if selecting a seat would create an isolated single seat
const wouldCreateSingleIsolatedSeat = (
  seatToSelect: TicketDetail,
  currentSelectedSeats: SelectedSeat[],
  allSeats: TicketDetail[]
): boolean => {
  // Get the row of the seat we're trying to select
  const seatRow = seatToSelect.seat.atRow;

  // Get all seats in the same row
  const allSeatsInRow = allSeats.filter(s => s.seat.atRow === seatRow);

  // Sort seats by column number
  allSeatsInRow.sort((a, b) =>
    a.seat.atColumn - b.seat.atColumn
  );

  // Create a map of seat status in this row (true = occupied or will be occupied)
  const seatMap: boolean[] = allSeatsInRow.map(rowSeat => {
    // Seat is already bought or pending by someone else
    if (rowSeat.status === 1 || rowSeat.status === 2) {
      return true;
    }

    // Seat is currently selected by user
    if (currentSelectedSeats.some(s => s.id === rowSeat.seatId)) {
      return true;
    }

    // This is the new seat we're trying to select
    if (rowSeat.seatId === seatToSelect.seatId) {
      return true;
    }

    // Otherwise, the seat is available
    return false;
  });

  // Check for isolated single available seats (empty seat with occupied seats on both sides)
  for (let i = 1; i < seatMap.length - 1; i++) {
    // If this seat is available, and both adjacent seats would be occupied
    if (!seatMap[i] && seatMap[i-1] && seatMap[i+1]) {
      return true; // This would create an isolated seat
    }
  }

  return false;
};

// Seat button component - extracted from the main component
const SeatButton: React.FC<SeatButtonProps> = ({
  ticket,
  isSelectedByMe,
  canSelect,
  handleSeatClick
}) => {
  const isPending = ticket.status === 1;
  const isBought = ticket.status === 2;
  const isVip = ticket.seat.seatType.typeName === "VIP";
  const isCouple = ticket.seat.seatType.typeName === "Couple";
  const seatTypeId = ticket.seat.seatType.seatTypeId;

  const isDisabled = !canSelect || isPending || isBought;

  let iconColor = "white";
  let backgroundColor = "transparent";

  if (isSelectedByMe) {
    iconColor = "green";
    backgroundColor = "rgba(0, 255, 0, 0.2)";
  } else if (isBought) {
    iconColor = "red";
    backgroundColor = "rgba(255, 0, 0, 0.2)";
  } else if (isPending) {
    iconColor = "yellow";
    backgroundColor = "rgba(255, 255, 0, 0.2)";
  } else if (isVip) {
    iconColor = canSelect ? "blue" : "gray";
    backgroundColor = canSelect ? "rgba(0, 0, 255, 0.2)" : "rgba(128, 128, 128, 0.2)";
  } else if (isCouple) {
    iconColor = canSelect ? "purple" : "gray";
    backgroundColor = canSelect ? "rgba(128, 0, 128, 0.2)" : "rgba(128, 128, 128, 0.2)";
  } else if (!canSelect) {
    iconColor = "gray";
    backgroundColor = "rgba(128, 128, 128, 0.2)";
  }

  return (
    <Button
      variant="outlined"
      disabled={isDisabled}
      onClick={() => handleSeatClick(ticket)}
      data-seat-id={ticket.seatId}
      data-status={ticket.status}
      data-seat-type={seatTypeId}
      sx={{
        minWidth: "50px",
        minHeight: "50px",
        backgroundColor,
        color: "white",
        p: 0.5,
        fontSize: "0.7rem",
        "&:hover": {
          backgroundColor: isSelectedByMe ? "rgba(0, 255, 0, 0.4)" : canSelect ? "rgba(255,255,255,0.2)" : "rgba(128, 128, 128, 0.2)",
          cursor: canSelect ? "pointer" : "not-allowed",
        },
        "&.Mui-disabled": {
          backgroundColor,
          color: "white",
          opacity: !canSelect && !isPending && !isBought ? 0.5 : 1,
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <EventSeatIcon sx={{ color: iconColor }} />
        <Typography variant="body2" align="center">
          {ticket.seat.atRow}
          {ticket.seat.atColumn}
        </Typography>
      </Box>
    </Button>
  );
};

// Cinema Screen component - extracted from the main component
const CinemaScreen: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Box sx={{ textAlign: "center", mb: 2 }}>
      <Box
        sx={{
          margin: "0 auto",
          width: "80%",
          height: "70px",
          borderTop: "6px solid #fff",
          borderRadius: "50% 50% 0 0",
        }}
      />
      <Typography variant="h6" sx={{ mt: -2, color: "white" }}>
        {t("movie_seat.selection")}
      </Typography>
    </Box>
  );
};

// Main component
const SeatCinema: React.FC<SeatProps> = ({
  showTimeId,
  selectedSeats,
  setSelectedSeats,
  groupConnected,
  userTickets = []
}) => {
  const { t } = useTranslation();
  const { connection } = useSignalR();
  const { userDetails } = useAuth();
  const [seats, setSeats] = useState<TicketDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Track selected seats by type
  const [selectedSeatsByType, setSelectedSeatsByType] = useState<Record<string, number>>({});

  // Determine the effective showTimeId: use the prop if provided, otherwise fallback to sessionStorage.
  const effectiveShowTimeId = showTimeId || sessionStorage.getItem("currentShowTimeId") || "";

  // Update the selected seats by type whenever selectedSeats changes
  // Update the useEffect that tracks selected seats
  useEffect(() => {
    const typeCount: Record<string, number> = {};

    selectedSeats.forEach((selectedSeat) => {
      const seat = seats.find((s) => s.seatId === selectedSeat.id);
      if (seat) {
        const seatTypeId = seat.seat.seatType.seatTypeId;
        typeCount[seatTypeId] = (typeCount[seatTypeId] || 0) + 1;
      }
    });

    setSelectedSeatsByType(typeCount);
  }, [selectedSeats, seats]);

  // Check if seats are adjacent (next to each other)
  const areSeatsAdjacent = (seatA: TicketDetail, selectedSeatsDetails: TicketDetail[]): boolean => {
    // If no seats are selected yet, allow any seat
    if (selectedSeatsDetails.length === 0) return true;

    // Check for both horizontal adjacency (same row) and vertical adjacency (same column)
    for (const selectedSeat of selectedSeatsDetails) {
      const rowA = seatA.seat.atRow;
      const rowB = selectedSeat.seat.atRow;
      const colA = seatA.seat.atColumn;
      const colB = selectedSeat.seat.atColumn;

      // Case 1: Same row, adjacent columns (horizontal adjacency)
      if (rowA === rowB && Math.abs(colA - colB) === 1) {
        return true;
      }

      // Case 2: Same column, adjacent rows (vertical adjacency)
      // Convert row letters to numbers (A=1, B=2, etc.) to check adjacency
      const rowANum = rowA.charCodeAt(0);
      const rowBNum = rowB.charCodeAt(0);
      if (colA === colB && Math.abs(rowANum - rowBNum) === 1) {
        return true;
      }
    }

    // If we're here, this seat is not adjacent to any currently selected seat
    return false;
  };

  // Check if removing a seat would break contiguity
  const wouldBreakContiguity = (seatToRemove: SelectedSeat, allSeats: TicketDetail[]): boolean => {
    // If there are 2 or fewer seats selected, removing any is fine
    if (selectedSeats.length <= 2) return false;

    // Get details of all currently selected seats
    const selectedSeatsDetails = selectedSeats
      .map(s => allSeats.find(seat => seat.seatId === s.id))
      .filter(Boolean) as TicketDetail[];

    // Get the seat we want to remove
    const seatDetail = allSeats.find(s => s.seatId === seatToRemove.id);
    if (!seatDetail) return false;

    // Create a temporary array without the seat we want to remove
    const remainingSeats = selectedSeatsDetails.filter(s => s.seatId !== seatDetail.seatId);

    // If we would have just one seat left, removing is always fine
    if (remainingSeats.length <= 1) return false;

    // We'll use a depth-first search to check if all remaining seats are connected
    const visited = new Set<string>();

    // Helper function for depth-first search
    const dfs = (seat: TicketDetail) => {
      const seatKey = `${seat.seat.atRow}${seat.seat.atColumn}`;
      visited.add(seatKey);

      // Check all remaining seats to find adjacent ones
      for (const otherSeat of remainingSeats) {
        const otherSeatKey = `${otherSeat.seat.atRow}${otherSeat.seat.atColumn}`;

        // Skip if already visited
        if (visited.has(otherSeatKey)) continue;

        const rowA = seat.seat.atRow;
        const rowB = otherSeat.seat.atRow;
        const colA = seat.seat.atColumn;
        const colB = otherSeat.seat.atColumn;

        // Check both horizontal and vertical adjacency
        const isHorizontallyAdjacent = rowA === rowB && Math.abs(colA - colB) === 1;
        const isVerticallyAdjacent = colA === colB && Math.abs(rowA.charCodeAt(0) - rowB.charCodeAt(0)) === 1;

        // If adjacent, continue the DFS
        if (isHorizontallyAdjacent || isVerticallyAdjacent) {
          dfs(otherSeat);
        }
      }
    };

    // Start DFS from the first remaining seat
    dfs(remainingSeats[0]);

    // If all remaining seats were visited in DFS, they form a connected group
    // If not all were visited, removing the seat would break contiguity
    return visited.size !== remainingSeats.length;
  };

  // Check if a seat can be selected based on user's ticket selection
  const canSelectSeat = (seatTypeId: string): boolean => {
    // If no user tickets are specified, allow all seats
    if (!userTickets || userTickets.length === 0) return true;

    // Find the user ticket that matches this seat type
    const userTicket = userTickets.find((ticket) => ticket.seatTypeId === seatTypeId);

    // If user doesn't have this type of ticket, they can't select it
    if (!userTicket) return false;

    // Check if user has already selected the maximum allowed for this type
    const currentlySelected = selectedSeatsByType[seatTypeId] || 0;
    return currentlySelected < userTicket.quantity;
  };

  // Listen for backend status updates (pending, bought, etc.) via SignalR.
  useEffect(() => {
    if (!connection || !groupConnected) return;

    const handleSeatPending = (seatId: string, userId: string) => {
      console.log("Seat marked as pending:", seatId);
      const currentUserId = userDetails?.userId;
      if (userId !== currentUserId) {
        setSeats((prev) => prev.map((ticket) => (ticket.seatId === seatId ? { ...ticket, status: 1 } : ticket)));

        // Also remove this seat from our selection if we had it selected
        setSelectedSeats((prev) => {
          const selectedSeat = prev.find((seat) => seat.id === seatId);
          if (selectedSeat) {
            toast.error(`${selectedSeat.name} ${t("toast.error.seat.someone_selected")}`);
            return prev.filter((seat) => seat.id !== seatId);
          }
          return prev;
        });
      }
    };

    const handleSeatBought = (seatId: string) => {
      setSeats((prev) => prev.map((ticket) => (ticket.seatId === seatId ? { ...ticket, status: 2 } : ticket)));
    };

    const handleSeatSelected = (seatId: string, userId: string) => {
      const currentUserId = userDetails?.userId;
      if (userId !== currentUserId) {
        setSeats((prev) => prev.map((ticket) => (ticket.seatId === seatId ? { ...ticket, status: 1 } : ticket)));
      }
    };

    const handleSeatAvailable = (seatId: string) => {
      console.log("Received SeatAvailable event for:", seatId);

      setSeats((prev) => prev.map((ticket) => (ticket.seatId === seatId ? { ...ticket, status: 0 } : ticket)));
      // Remove auto-released seats from the current selection using ticketId
      setSelectedSeats((prev) => prev.filter((seat) => seat.id !== seatId));
    };

    connection.on("SeatPending", handleSeatPending);
    connection.on("SeatBought", handleSeatBought);
    connection.on("SeatSelected", handleSeatSelected);
    connection.on("SeatAvailable", handleSeatAvailable);

    return () => {
      connection.off("SeatPending", handleSeatPending);
      connection.off("SeatBought", handleSeatBought);
      connection.off("SeatSelected", handleSeatSelected);
      connection.off("SeatAvailable", handleSeatAvailable);
    };
  }, [connection, groupConnected, setSelectedSeats]);

  useEffect(() => {
    const releaseSeatsOnReturn = async () => {
      if (connection && selectedSeats.length > 0) {
        const userId = userDetails?.userId;
        const ticketRequests = selectedSeats.map((seat) => ({
          TicketId: seat.ticketId,
          Version: seat.version,
        }));

        try {
          await connection.invoke("ReleasePendingSeats", ticketRequests, effectiveShowTimeId, userId);
          setSelectedSeats([]); // Clear locally stored selections
          toast(t("toast.error.seat.cancel_booking_bc_back"), {
            position: "top-center",
          });
        } catch (error) {
          console.error("Error releasing seats on return:", error);
        }
      }
    };

    releaseSeatsOnReturn();
  }, [connection]);

  // Fetch ticket data by effectiveShowTimeId.
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        setLoading(true);
        const response = await api.get(`ticketdetail/showtime/${effectiveShowTimeId}`);
        if (response.data?.data) {
          setSeats(response.data.data);
          console.log(`Fetched seats: ${JSON.stringify(response.data.data, null, 2)}`);

        } else {
          toast.error(t("toast.error.seat.infor"));
        }
      } catch (error) {
        toast.error(t("toast.error.seat.loading_list"));
      } finally {
        setLoading(false);
      }
    };
    if (effectiveShowTimeId) {
      fetchSeats();
    }
  }, [effectiveShowTimeId]);

  // Handle seat selection/deselection
  const handleSeatClick = useCallback(async (ticket: TicketDetail) => {
    if (!connection) {
      toast.error(t("toast.error.server.connection"));
      return;
    }

    // Don't allow selecting seats that are already pending or bought
    if (ticket.status === 1 || ticket.status === 2) {
      const statusText = ticket.status === 1 ? t("toast.error.seat.selecting") : t("toast.error.seat.bought");
      toast.error(`${ticket.seat.atRow}${ticket.seat.atColumn} ${statusText} ${t("toast.error.seat.by_someone")}`);
      return;
    }

    const seatTypeId = ticket.seat.seatType.seatTypeId;
    const isAlreadySelected = selectedSeats.some((s) => s.id === ticket.seatId);

    // Handle seat deselection
    if (isAlreadySelected) {
      // Get the selected seat object
      const selectedSeat = selectedSeats.find(s => s.id === ticket.seatId);

      // Check if deselecting this seat would break the contiguity rule
      if (selectedSeat && wouldBreakContiguity(selectedSeat, seats)) {
        toast.error(t("toast.error.seat.cannot_deselect_middle"));
        return;
      }
    }
    // Handle new seat selection
    else {
      // First check if user can select it based on their tickets
      if (!canSelectSeat(seatTypeId)) {
        toast.error(`${t("toast.error.seat.no_more_tickets")} ${seatTypeId}`);
        return;
      }

      // Then check for adjacency with currently selected seats
      if (selectedSeats.length > 0 && !areSeatsAdjacent(ticket, selectedSeats.map(s => seats.find(seat => seat.seatId === s.id)).filter(Boolean) as TicketDetail[])) {
        toast.error(t("toast.error.seat.adjacent_only"));
        return;
      }

      // Check if this selection would create an isolated single seat
      if (wouldCreateSingleIsolatedSeat(ticket, selectedSeats, seats)) {
        toast.error(t("toast.error.seat.no_single_isolated"));
        return;
      }
    }

    const seatName = `${ticket.seat.atRow}${ticket.seat.atColumn}`;
    const seatInfo: SelectedSeat = {
      id: ticket.seatId,
      name: seatName,
      version: ticket.version,
      ticketId: ticket.ticketId,
      roomName: ticket.seat.roomName,
      isMine: true,
      selectedAt: Date.now(),
    };

    try {
      const userId = userDetails?.userId;

      // Prepare the updated seats selection based on the user's action
      let updatedSeats: SelectedSeat[] = [...selectedSeats]; // Start with current selection
      const existingSeatIndex = selectedSeats.findIndex((s) => s.ticketId === ticket.ticketId);

      if (existingSeatIndex !== -1) {
        if (selectedSeats[existingSeatIndex].id === ticket.seatId) {
          // User is deselecting this seat
          updatedSeats = updatedSeats.filter((s) => s.ticketId !== ticket.ticketId);
        } else {
          // User is changing from one seat to another with the same ticketId
          updatedSeats[existingSeatIndex] = seatInfo;
        }
      } else {
        // User is selecting a new seat
        updatedSeats.push(seatInfo);
      }

      // Create ticket requests from the updated selection
      const ticketRequests = updatedSeats.map((seat) => ({
        TicketId: seat.ticketId,
        Version: seat.version,
      }));

      console.log("Selecting seat:", seatName, ticketRequests, effectiveShowTimeId, userId);

      // Send the COMPLETE updated selection to server
      await connection.invoke("SelectSeat", ticketRequests, effectiveShowTimeId, userId);

      // Update local state if server operation succeeded
      setSelectedSeats((prevSeats) => {
        const existingSeat = prevSeats.find((s) => s.ticketId === ticket.ticketId);
        if (existingSeat) {
          if (existingSeat.id === ticket.seatId) {
            // toast.error(`${t("toast.error.seat.cancel_select")} ${seatName}`);
            return prevSeats.filter((s) => s.ticketId !== ticket.ticketId);
          } else {
            toast.success(`${t("toast.success.seat.change_from")} ${existingSeat.name} ${t("toast.success.seat.change_to")} ${seatName}`);
            return prevSeats.map((s) => (s.ticketId === ticket.ticketId ? seatInfo : s));
          }
        } else {
          toast.success(`${t("toast.success.seat.select")} ${seatName}`);
          return [...prevSeats, seatInfo];
        }
      });
    } catch (error) {
      toast.error(t("toast.error.seat.cannot_selected"));
      console.error("Error selecting seat:", error);
    }
  }, [connection, selectedSeats, canSelectSeat, areSeatsAdjacent, wouldBreakContiguity, effectiveShowTimeId, userDetails, t, seats]);

  if (loading) return <Loader />;

  return (
    <Box sx={{ color: "white", pb: 4, position: "relative" }}>
      {/* Screen Display */}
      <CinemaScreen />

      {/* Seat Grid */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 2 }}>
        <Box sx={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: 2 }}>
          {Object.entries(
            seats.reduce(
              (acc, ticket) => {
                if (!acc[ticket.seat.atRow]) acc[ticket.seat.atRow] = [];
                acc[ticket.seat.atRow].push(ticket);
                return acc;
              },
              {} as Record<string, TicketDetail[]>,
            ),
          ).map(([row, rowSeats]) => (
            <Box key={row} sx={{ display: "flex", justifyContent: "center", gap: 4 }}>
              {rowSeats.map((ticket) => {
                const isSelectedByMe = selectedSeats.some((s) => s.id === ticket.seatId && s.isMine);
                const canSelect = canSelectSeat(ticket.seat.seatType.seatTypeId) || isSelectedByMe;

                return (
                  <SeatButton
                    key={ticket.seatId}
                    ticket={ticket}
                    isSelectedByMe={isSelectedByMe}
                    canSelect={canSelect}
                    handleSeatClick={handleSeatClick}
                  />
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SeatCinema;
