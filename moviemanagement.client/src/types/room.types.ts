import { Seat } from "./seat.types";

export interface Room {
  roomId: string;
  name: string | null;
  row: number;
  column: number;
  total: number;
  seats: Seat[];
}
