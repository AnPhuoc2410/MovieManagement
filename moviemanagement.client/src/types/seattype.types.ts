export type SeatType = {
  seatTypeId: string;
  typeName: string;
  price: number;
  quantity: number;
  isActive: boolean;
};

export type SeatTypeCompact = Pick<SeatType, "seatTypeId" | "quantity" | "typeName" | "price" | "quantity">;

export type MovieSeatState = {
  movieId?: string;
  showTimeId: string;
  selectedDate: string;
  selectedTime: string;
  tickets: SeatTypeCompact[];
  movieData: {
    movieId: string;
    movieName: string;
    image: string;
    postDate: string;
    fromDate: string; // Same as above
    toDate: string; // Same as above
    actors: string;
    director: string;
    rating: string;
    duration: number; // In minutes
    version: string;
    trailer: string;
    content: string;
    userId: string;
    categories: {
      categoryId: string;
      name: string;
    }[]; // Array of category objects
  };
};
