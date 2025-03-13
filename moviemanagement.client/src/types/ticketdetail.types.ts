import { Bill } from "./bill.types";
import { Seat } from "./seat.types";
import { ShowTime } from "./showtime.types";

export interface TicketDetail {
  ticketId: string;
  seatId: string;
  version: string;
  status: number;
  seat: Seat;
  showTime: ShowTime;
  bill: Bill;
}

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
