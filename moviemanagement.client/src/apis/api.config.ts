export type ApiResponse<T> = {
  message: string;
  status_code: number;
  is_success: boolean;
  data: T | null;
};
