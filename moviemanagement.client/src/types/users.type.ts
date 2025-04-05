import { ShowTime } from "./showtime.types";
import { TicketDetail, UserTicketHistory, UserTicketType } from "./ticketdetail.types";

export type UserBase = {
  userId: string;
  userName: string;
  password: string;
  avatar: string | null;
  joinDate: string;
  fullName: string;
  birthDate: string | null;
  gender: number;
  idCard: string;
  email: string;
  phoneNumber: string;
  address: string;
  status: number | 1;
  role: number;
  point: number;
};

export type AddEmployee = Omit<UserBase, "role" | "userId" | "point" | "status" | "joinDate"> & {
  confirmPassword: string;
};

export interface UserResponse {
  userId: string;
  userName: string;
  avatar: string;
  joinDate: string;
  fullName: string;
  birthDate: string | null;
  gender: number;
  idCard: string;
  email: string;
  phoneNumber: string;
  address: string;
  status: number;
  role: number;
  point: number;
}

export type UserProfile = Pick<UserResponse, "birthDate" | "gender" | "idCard" | "fullName" | "email" | "phoneNumber" | "address" | "point" | "userName" | "avatar"> & {
  ticket?: {
    history?: UserTicketHistory[];
    data?: UserTicketType[];
  };
};

export type UserTransactionHistory = {
  billId: string;
  paymentId: number | null;
  createdDate: string;
  point: number;
  minusPoint: number;
  totalTicket: number;
  amount: number;
  userId: string;
  promotionId: string;
  status: number;
  ticketDetails: {
    ticketId: string;
    billId: string;
    seatId: string;
    showTimeId: string;
    status: number;
    showTime: {
      showTimeId: string;
      movieId: string;
      roomId: string;
      startTime: string;
      endTime: string;
      movie: {
        movieId: string;
        movieName: string;
        image: string;
        postDate: string;
        fromDate: string;
        toDate: string;
        actors: string;
        director: string;
        rating: string;
        duration: number;
        version: string;
        trailer: string;
        content: string;
        userId: string; //not need
        categories: [];
      };
      room: string | null;
    };
  }[];
};

export type UpdatePasswordDTO = {
  email: string;
  new_password: string;
};

export type UserInfo = {
  userId: string;
  userName: string;
  email: string;
  phoneNumber: string;
  point: number;
  avatarUrl?: string;
  idCard: string;
};
