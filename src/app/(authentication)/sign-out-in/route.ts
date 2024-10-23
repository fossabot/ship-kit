// This happens when the authentication token expires or there is an error refreshing.
// This will log the user out, then redirect to the sign in page

// This is a Route Handler, not a Next.js page, because signOut needs to be called by a server action or Route Handler
import { routes } from "@/config/routes";
import { STATUS_CODES } from "@/lib/constants/status-codes";
import logger from "@/lib/services/logger";
import { routeRedirectWithCode } from "@/lib/utils/redirect-with-code";
import { signOut } from "@/server/auth";
import { createSafeRoute } from "next-safe-route";
import { z } from "zod";

const querySchema = z.object({
  code: z
    .enum(
      Object.keys(STATUS_CODES) as [
        keyof typeof STATUS_CODES,
        ...Array<keyof typeof STATUS_CODES>,
      ],
    )
    .optional(),
});

const handler = async (request: Request, context: any) => {
  const code = context?.query?.code ?? STATUS_CODES.AUTH_REFRESH.code;

  logger.info(`sign-out-in/route.ts - Signing out with code: ${code}`);
  await signOut({ redirect: false }).catch((error) => {
    logger.error(`sign-out-in/route.ts - Sign out error: ${error}`);
  });

  return routeRedirectWithCode(routes.auth.signIn, { code, request });
};

export const GET = createSafeRoute().query(querySchema).handler(handler);
