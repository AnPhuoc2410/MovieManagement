import { Bill } from "./bill.types";
import { Seat } from "./seat.types";
import { ShowTime } from "./showtime.types";

export type TicketDetail = {
  billId: string;
  seatId: string;
  showTimeId: string;
  bill: Bill;
  seat: Seat;
  showTime: ShowTime;
};
