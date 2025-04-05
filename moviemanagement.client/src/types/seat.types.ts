import { SeatType } from "./seattype.types";

export type Seat = {
  seatId: string;
  atRow: string;
  atColumn: number;
  isActive: boolean;
  status: number;
  seatType: SeatType;
  roomName: string;
};
