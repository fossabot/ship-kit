import { routes } from "@/config/routes";
import { STATUS_CODES } from "@/config/status-codes";
import { logger } from "@/lib/logger";
import { redirectWithCode } from "@/lib/utils/redirect-with-code";
import { authOptions } from "@/server/auth.config";
import { db } from "@/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/server/db/schema";
import { type UserRole } from "@/types/user";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

const {
  auth: nextAuthAuth,
  handlers,
  signIn,
  signOut,
  unstable_update: update,
} = NextAuth({
  ...authOptions,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  logger: {
    error: (code, ...message) => logger.error(code, message),
    warn: (code, ...message) => logger.warn(code, message),
    debug: (code, ...message) => logger.debug(code, message),
  },
});

interface AuthProps {
  errorCode?: string;
  nextUrl?: string;
  protect?: boolean;
  redirect?: boolean;
  redirectTo?: string;
  role?: UserRole;
}

/**
 * Enhanced authentication function with redirect functionality
 * @param props - Authentication properties including redirect options
 */
const authWithOptions = async (props?: AuthProps) => {
  const session = await nextAuthAuth();
  const { errorCode, redirect, nextUrl } = props ?? {};
  const protect =
    props?.protect ?? props?.redirectTo !== undefined ?? redirect ?? false;
  const redirectTo = props?.redirectTo ?? routes.auth.signOutIn;

  const handleRedirect = (code: string) => {
    logger.warn(
      `[authWithOptions] Redirecting to ${redirectTo} with code ${code}`,
    );
    return redirectWithCode(redirectTo, { code, nextUrl });
  };

  // TODO: Handle refresh token error
  // if (session?.error === "RefreshTokenError") {
  //   return handleRedirect(STATUS_CODES.AUTH_REFRESH.code);
  // }

  if (protect && !session?.user?.id) {
    return handleRedirect(errorCode ?? STATUS_CODES.AUTH.code);
  }

  // TODO: RBAC
  // if (role && session?.user?.role !== role) {
  //   return handleRedirect(errorCode ?? STATUS_CODES.AUTH_ROLE.code); // TODO: We shouldn't sign them out
  // }

  return session;
};

export { authWithOptions as auth, handlers, signIn, signOut, update };

// TODO: Dedupe like this from create-t3-turbo:
// import { cache } from "react";
// import NextAuth from "next-auth";

// import { authConfig } from "./config";

// export type { Session } from "next-auth";

// const { handlers, auth: defaultAuth, signIn, signOut } = NextAuth(authConfig);

// /**
//  * This is the main way to get session data for your RSCs.
//  * This will de-duplicate all calls to next-auth's default `auth()` function and only call it once per request
//  */
// const auth = cache(defaultAuth);

// export { handlers, auth, signIn, signOut };

// export {
//     invalidateSessionToken,
//     validateToken,
//     isSecureContext,
// } from "./config";

export async function verifyUser(email: string, password: string) {
  const user = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      emailVerified: users.emailVerified,
      image: users.image,
      password: users.password, // Ensure the password field is included
    })
    .from(users)
    .where(eq(users.email, email))
    .execute();

  if (user[0] && user[0].password === hashPassword(password)) {
    return user[0];
  }
  return null;
}

function hashPassword(password: string) {
  // Implement your password hashing logic here
  return password; // Replace with actual hashing
}
