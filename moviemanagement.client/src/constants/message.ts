export const SUCCESS_MESSAGE = {
  BID_PLACED: "Bid placed successfully!",
  LOGIN_SUCCESS: "Login successful!",
  LOGOUT_SUCCESS: "Logout successful!",
  REGISTER_SUCCESS: "Registration successful!",
  DEPOSIT_SUCCESS: "Deposit successful!",
  OTP_VERIFY_SUCCESS: "OTP verification successful!",
  HIGHEST_BID_RECEIVED: "New highest bid received!",
  //"Koi registered successfully!"
  REGISTER_KOI_SUCCESS:
    "Koi registered successfully!, refresh the page to apply changes",
  DELETE_KOI_SUCCESS:
    "Koi deleted successfully!, refresh the page to apply changes",
  REDO_BREEDER_SUCCESS:
    "Redo Breeder successfully, refresh the page to apply changes",
  REDO_STAFF_SUCCESS:
    "Redo Staff successfully, refresh the page to apply changes",
  REDO_MEMBER_SUCCESS:
    "Redo Member successfully, refresh the page to apply changes",
  DELETE_STAFF_SUCCESS:
    "Staff deleted successfully!, refresh the page to apply changes",
  DELETE_BREEDER_SUCCESS:
    "Breeder deleted successfully, , refresh the page to apply changes",
  DELETE_MEMBER_SUCCESS:
    "Member deleted successfully, , refresh the page to apply changes",
  REVOKE_KOI_FROM_AUCTION_SUCCESS:
    "Koi revoked from auction successfully!, refresh the page to apply changes",
  AUCTION_UPDATE_SUCCESS:
    "Auction updated successfully!, refresh the page to apply changes",
  AUCTION_DELETE_SUCCESS:
    "Auction deleted successfully!, refresh the page to apply changes",
} as const;

export const ERROR_MESSAGE = {
  REQUIRED_LOGIN_TO_BID: "Please log in before placing a bid.",
  UNEXPECTED_ERROR_BID: "An unexpected error occurred while placing your bid.",
  OTP_VERIFICATION_ERROR: "An error occurred during OTP verification.",
  SELECT_KOI_AND_AUCTION: "Please select a koi and an auction to place a bid.",
  REDO_BREEDER_FAILED: "Failed to redo breeder",
  REDO_STAFF_FAILED: "Failed to redo staff",
  REDO_MEMBER_FAILED: "Failed to redo member",
  DELETE_MEMBER_FAILED: "Failed to delete breeder",
  REGISTER_KOI_FAILED: "Failed to register koi.",
  DELETE_KOI_FAILED: "Failed to delete koi.",
  FETCH_KOI_ERROR: "Error fetching kois",
  DELETE_STAFF_FAILED: "Failed to delete staff",
  FAILED_TO_LOAD_AUCTION_DETAILS: "Failed to load auction details.",
  FAILED_TO_FETCH_BIDDING_HISTORY: "Failed to fetch bidding history.",
  DELETE_BREEDER_FAILED: "Failed to delete breeder",
  FAILED_TO_FETCH_AUCTIONS: "Failed to fetch auctions.",
  FAILED_TO_LOAD_BANKS_LIST: "Failed to load banks list.",
  ERROR_CREATING_KOI: "Error creating koi.",
  UNEXPECTED_ERROR: "An unexpected error occurred.",
  LOGIN_ERROR: "An error occurred during login",
  REGISTER_ERROR: "An error occurred during registration",

  REVOKE_KOI_FROM_AUCTION_ERROR:
    "An error occurred during revoke koi from auction",

  FETCH_USER_DETAILS_ERROR: "An error occurred during fetch user details",

  VERIFY_OTP_ERROR: "An error occurred during OTP verification",
  SEND_OTP_ERROR: "An error occurred during sending OTP",

  CREATE_AUCTION_ERROR: "An error occurred during auction creation",
  FETCH_AUCTION_ERROR: "An error occurred during auction fetching",
  FETCH_AUCTION_BY_STATUS_ERROR:
    "An error occurred during fetching auction by status",
  FETCH_AUCTION_BY_ID_ERROR: "An error occurred during fetching auction by ID",
  FETCH_AUCTION_KOI_ERROR: "An error occurred during fetching auction koi",
  FETCH_BREEDER_KOI_ERROR: "An error occurred during fetching breeder koi",
  FETCH_BREEDER_KOI_WITH_STATUS_ERROR:
    "An error occurred during fetching breeder koi with status",
  FETCH_KOI_BY_ID_ERROR: "An error occurred during fetching koi by ID",
  FAILED_TO_LOAD_AUCTION_KOI_DETAILS: "Failed to load auction koi details.",
  FAILED_TO_UPDATE_KOI: "Failed to update koi.",
  FAILED_TO_LOAD_KOI_DETAILS: "Failed to load koi details.",
  FAILED_TO_LOAD_KOIS: "Failed to load kois.",
  FAILED_TO_DELETE_KOI: "Failed to delete koi.",
  FAILED_TO_LOAD_KOIS_IN_AUCTION: "Failed to load kois in auction.",
  UPDATE_AUCTION_ERROR: "An error occurred during update auction",
  DELETE_AUCTION_ERROR: "An error occurred during delete auction",
  END_AUCTION_ERROR: "An error occurred during end auction",
  FETCH_AUCTION_STATUS_COUNT_ERROR:
    "An error occurred during fetch auction status count",
  CREATE_AUCTION_KOI_ERROR: "An error occurred during create auction koi",
  FETCH_QUANTITY_KOI_IN_AUCTION_BY_BID_METHOD_ERROR:
    "An error occurred during fetch quantity koi in auction by bid method",

  UPDATE_ACCOUNT_BALANCE_ERROR:
    "An error occurred during update account balance",

  FETCH_BREEDERS_ERROR: "An error occurred during fetching breeders",
  FETCH_BREEDER_BY_ID_ERROR: "An error occurred during fetching breeder by ID",
  CREATE_BREEDER_ERROR: "An error occurred during creating breeder",
  UPDATE_BREEDER_ERROR: "An error occurred during updating breeder",
  DELETE_BREEDER_ERROR: "An error occurred during deleting breeder",

  FETCH_MEMBERS_ERROR: "An error occurred during fetching members",
  FETCH_MEMBER_BY_ID_ERROR: "An error occurred during fetching member by ID",
  CREATE_MEMBER_ERROR: "An error occurred during creating member",
  UPDATE_MEMBER_ERROR: "An error occurred during updating member",
  DELETE_MEMBER_ERROR: "An error occurred during deleting member",

  FETCH_MANAGER_ERROR: "An error occurred during fetching manager",
  FETCH_MANAGER_BY_ID_ERROR: "An error occurred during fetching manager by ID",
  CREATE_MANAGER_ERROR: "An error occurred during creating manager",
  UPDATE_MANAGER_ERROR: "An error occurred during updating manager",
  DELETE_MANAGER_ERROR: "An error occurred during deleting manager",

  FETCH_STAFF_ERROR: "An error occurred during fetching staff",
  CREATE_STAFF_ERROR: "An error occurred during creating staff",
  UPDATE_STAFF_ERROR: "An error occurred during updating staff",
  DELETE_STAFF_ERROR: "An error occurred during deleting staff",
  FETCH_STAFF_BY_ID_ERROR: "An error occurred during fetching staff by ID",

  FETCH_ORDER_DETAILS_ERROR: "An error occurred during fetching order details",
} as const;

export const BIDDING_MESSAGE = {
  ERROR_LOADING_BIDDING_HISTORY: "Error loading bidding history.",
  CONGRATULATION_WINNING_BID:
    "Congratulations! You've won the auction. Redirecting to order page...",
  BIDDING_DIVISIBLE_BY_1000: "Bidding amount must be divisible by 1000.",
} as const;

export const GENERAL_TOAST_MESSAGE = {
  UNEXPECTED_ERROR: "An unexpected error occurred.",
  PLEASE_LOGIN_TO_ACCESS_THIS_FEATURE: "Please login to access this feature!",
  FAILED_TO_LOAD_AUCTION_DETAILS:
    "Failed to load auction details. Please try again.",
  FAILED_TO_LOAD_BANKS_LIST: "Failed to load banks list.",
  AMOUNT_MUST_BE_GREATER_THAN_ZERO: "Amount must be greater than 0.",
  PLEASE_SELECT_BANK: "Please select a bank.",
  FAILED_TO_CREATE_PAYMENT_URL: "Failed to create payment URL.",
  DRAW_OUT_REQUEST_CREATED_SUCCESSFULLY:
    "Draw-out request created successfully.",
  LOGIN_SUCCESSFULLY: "Login successfully!",
  WRONG_EMAIL_OR_PASSWORD: "Wrong email or password",
  PLEASE_ENTER_VALID_EMAIL_TO_FORGOT_PASSWORD:
    "Please enter a valid email to reset your password.",
  REGISTER_SUCCESSFULLY: "Registered successfully!",
} as const;

export const VALIDATION_MESSAGE = {
  ENTER_VALID_OTP_6_DIGIT: "Please enter a valid 6-digit OTP.",
} as const;

export const OTP_TOAST_MESSAGE = {
  INVALID_OTP: "Please enter a valid OTP.",
  FAILED_TO_SEND_OTP: "Failed to send OTP.",
  OTP_SENT: "OTP sent successfully!",
  OTP_RESEND: "OTP resent successfully!",
  OTP_VERIFIED: "OTP verified successfully!",
} as const;

export const LOGIN_FORM_TOAST_MESSAGE = {
  INVALID_EMAIL_FORGOT_PASSWORD_FORMAT:
    "Please enter a valid email address to reset your password.",
} as const;

export const CONFIRMATION_MESSAGE = {
  ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_KOI:
    "Are you sure you want to delete this koi? This action cannot be undone, please proceed with caution.",
  ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_AUCTION:
    "Are you sure you want to delete this auction?",
  ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_BREEDER:
    "Are you sure you want to delete this breeder?",
  ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_STAFF:
    "Are you sure you want to delete this staff? Please proceed with caution.",
  ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_MEMBER:
    "Are you sure you want to delete this member?",
  ARE_YOU_SURE_YOU_WANT_TO_REDO_THIS_BREEDER:
    "Are you sure you want to redo this breeder?",
  ARE_YOU_SURE_YOU_WANT_TO_REDO_THIS_STAFF:
    "Are you sure you want to redo this staff?",
  ARE_YOU_SURE_YOU_WANT_TO_REDO_THIS_MEMBER:
    "Are you sure you want to redo this member?",
} as const;
