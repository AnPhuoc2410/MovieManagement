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

export type UserTicketType = {
  id: string;
  movieName: string;
  dateStart: string;
  dateEnd: string;
  time: string;
  room: string;
  price: string;
  status: string;
};

export type UserTicketHistory = {
  dateCreate: string;
  movieName: string;
  plusPoint: number;
  minusPoint: number;
};
