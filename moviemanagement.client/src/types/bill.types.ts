import { UserBase } from "./users.type";

export type Bill = {
  billId: string; // Guid in C#
  createdDate: Date; // DateTime in C#
  point: number; // decimal in C#
  totalTicket: number; // int in C#
  amount: number; // decimal in C#
  userId: string; // Guid in C#
  promotionId: string; // Guid in C#
  status: number; // int in C# (0: Hủy đặt vé; 1: Chờ nhận vé; 2: Đã nhận vé)
  ticketDetails: TicketDetail[]; // ICollection in C# (as an array)
  user: UserBase; // Quan hệ với User
  promotion: Promotion; // Quan hệ với Promotion
};
