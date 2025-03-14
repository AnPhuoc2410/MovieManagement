export type ApiResponse<T> = {
  message: string;
  statusCode: number;
  isSuccess: boolean;
  reason: string | null;
  data: T | null;
};
