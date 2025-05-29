import { TableData } from "../components/shared/ManagementTable";
import { Category } from "./category.types";
import { ShowTime } from "./showtime.types";

export type Movie = {
  movieId: string; // Guid in C#
  movieName: string;
  image: string;
  postDate: string; // DateTime in C# as ISO string
  fromDate: string; // DateTime in C# as ISO string
  toDate: string; // DateTime in C# as ISO string
  actors: string;
  director: string;
  rating: string;
  duration: number; // int in C#
  version: string;
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
  postDate: string;
  director: string;
  duration: number;
  version: number;
}
