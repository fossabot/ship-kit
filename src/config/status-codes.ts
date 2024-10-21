export const STATUS_CODES = {
  AUTH: {
    code: "AUTH",
    message: "Please sign in and try again.",
  },
  AUTH_REFRESH: {
    code: "AUTH_REFRESH",
    message: "Your session has expired. Please sign in again.",
  },
  LOGIN: {
    code: "LOGIN",
    message: "There was a problem logging you in.",
  },
  CREDENTIALS: {
    code: "CREDENTIALS",
    message: "Invalid email or password.",
  },
  SIGNOUT: {
    code: "SIGNOUT",
    message: "You have been signed out.",
  },

  UNKNOWN: {
    code: "UNKNOWN",
    message: "Something went wrong, please try again.",
  },
} as const;

export type ErrorCodes = typeof STATUS_CODES;
