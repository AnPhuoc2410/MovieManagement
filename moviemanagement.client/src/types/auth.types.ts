import { UserLoginResponse } from "./users.type";

export type AuthLoginData = Pick<
  UserLoginResponse,
  "token" | "roles" | "id" | "username" | "status"
>;
