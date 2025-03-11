import { Movie } from "./movie.types";
import { Room } from "./room.types";
import { TicketDetail } from "./ticketdetail.types";

export type ShowTime = {
  showTimeId: string; // Guid in C#
  movieId: string; // Guid in C#
  roomId: string; // Guid in C#
  startTime: Date; // DateTime in C#
  endTime: string; // DateTime in C#
  movie?: Movie; // Quan hệ với Movie
  room?: Room; // Quan hệ với Room
  ticketDetails?: TicketDetail[]; // ICollection in C# (as an array)
};
