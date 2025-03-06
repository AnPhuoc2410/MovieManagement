import { Room } from "./room.types";
import { SeatType } from "./seattype.types";
import { TicketDetail } from "./ticketdetail.types";

export type Seat = {
  seatId: string; // Guid in C#
  atRow: string;
  atColumn: number; // int in C#
  roomId: string; // Guid in C#
  seatTypeId: string; // Guid in C#
  isActive: boolean; // bool in C#
  room: Room; // Quan hệ với Room
  seatType: SeatType; // Quan hệ với SeatType
  ticketDetail: TicketDetail[]; // ICollection in C# (as an array)
};
