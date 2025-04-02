import { TableData } from "../components/shared/ManagementTable";
import { Category } from "./category.types";
import { ShowTime } from "./showtime.types";

export type Movie = {
  movieId: string; // Guid in C#
  movieName: string;
  image: string;
  postDate: Date; // DateTime in C#
  fromDate: Date; // DateTime in C#
  toDate: Date; // DateTime in C#
  actors: string;
  director: string;
  rating: string;
  duration: number; // int in C#
  version: string; // int in C#
  trailer: string;
  content: string;
  userId?: string; // Guid in C#
  categories: Category[]; // ICollection in C# (as an array)
  showtimes: ShowTime[]; // ICollection in C# (as an array)
};

export type QuanLyPhimType = Pick<
  Movie,
  "movieId" | "movieName" | "postDate" | "director" | "duration" | "version"
>;

export interface QuanLyPhimColumn extends TableData {
  movieId: string;
  movieName: string;
  postDate: Date;
  director: string;
  duration: number;
  version: number;
}
