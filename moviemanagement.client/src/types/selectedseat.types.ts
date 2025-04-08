export type SelectedSeat = {
  id: string;
  name: string;
  version: string;
  ticketId: string;
  isMine?: boolean;
  selectedAt?: number;
  roomName?: string;
  seatTypeName?: string;
  price?:number;
};

