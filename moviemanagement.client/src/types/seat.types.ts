
export type Seat = {
  seatId: string;
  atRow: string;
  atColumn: number;
  isActive: boolean;
  status: number;
  seatType: {
    seatTypeId: string;
    typeName: string;
    price: number;
    isActive: boolean;
  };
};
