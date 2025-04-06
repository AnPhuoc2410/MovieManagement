export type PaymentState = {
  selectedTime: string;
  selectedDate: string;
  tickets: any[];
  seats: string[];
  showTimeId: string;
  selectedSeatsInfo: any[];
  movieData: {
    movieId?: string;
    movieName?: string;
    image?: string;
  };
  roomName: string;
  lastSelectionTime: number;
  resetCounter: number;
}
