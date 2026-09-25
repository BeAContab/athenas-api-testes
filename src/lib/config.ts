export const ATHENAS_API_BASE_URL =
  process.env.ATHENAS_API_BASE_URL ?? "https://api.athenas.online/v2";

export const SESSION_COOKIE = "athenas_token";
export const MODE_COOKIE = "athenas_mode";
export const USER_COOKIE = "athenas_user";

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
