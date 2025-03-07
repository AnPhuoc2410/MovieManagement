import { Bill } from "./bill.types";

export type Promotion = {
  promotionId: string; // Guid in C#
  promotionName: string;
  image: string;
  fromDate: Date; // DateTime in C#
  toDate: Date; // DateTime in C#
  discount: number; // decimal in C#
  content: string;
  bills: Bill[]; // ICollection in C# (as an array)
};
