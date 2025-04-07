export type SeatType = {
  seatTypeId: string;
  typeName: string;
  price: number;
  quantity: number;
  isActive: boolean;
};


export type MovieSeatState = {
  movieId?: string;
  showTimeId: string;
  selectedDate: string;
  selectedTime: string;
  tickets: SeatType[];
  movieData: {
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
    userId: string;
    categories: {
      categoryId: string;
      name: string;
    }[];
  };
};
