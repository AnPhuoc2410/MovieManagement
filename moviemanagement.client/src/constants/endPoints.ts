export const API_URL_DEPLOYMENT =
  "https://koi-auction-be-az-dtarcyafdhc2gcen.southeastasia-01.azurewebsites.net/api/v1";
export const API_URL_DEVELOPMENT = "http://localhost:4000/api/v1";
export const DYNAMIC_API_URL =
  import.meta.env.VITE_API_BASE_URL ?? API_URL_DEVELOPMENT;

export const ROUTING_PATH = {
  ROOT: "/",
  AUCTIONS: "/auctions",
  ABOUT: "/about",
  BLOG: "/blog",
  PRIVACY: "/privacy",
  TERMS: "/terms",
  AUTH: "/auth",
  MANAGERS: "/managers",
  STAFFS: "/staffs",
  BREEDERS: "/breeders",
  MEMBERS: "/members",
  ORDERS: "/orders",
  PAYMENTS: "/payments",
  OTP_VERIFICATION: "/otp-verification",
  FORGOT_PASSWORD: "/forgot-password",
  MEMBERS_ORDERS: "/members/orders",
  MANAGERS_HOME: "/managers",
  MANAGERS_KOI: "/managers/koi",
  MANAGERS_AUCTIONS: "/managers/auctions",
  MANAGERS_BREEDER: "/managers/breeder",
  MANAGERS_MEMBER: "/managers/member",
  MANAGERS_STAFF: "/managers/staff",
  MANAGERS_SETTING: "/managers/setting",
} as const;
