import { Seat } from "./seat.types";

export type SeatType = {
  seatTypeId: string; // Guid in C#
  typeName: string;
  price: number; // decimal in C#
  isActive: boolean; // bool in C#
  seats: Seat[]; // ICollection in C# (as an array)
};
