// This happens when the authentication token expires or there is an error refreshing.
// This will log the user out, then redirect to the sign in page

// This is a Route Handler, not a Next.js page, because signOut needs to be called by a server action or Route Handler
import { routes } from "@/config/routes";
import { STATUS_CODES } from "@/config/status-codes";
import { logger } from "@/lib/logger";
import { routeRedirectWithCode } from "@/lib/utils/redirect-with-code";
import { signOut } from "@/server/auth";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const querySchema = z.object({
  code: z
    .enum(
      Object.keys(STATUS_CODES) as [
        keyof typeof STATUS_CODES,
        ...(keyof typeof STATUS_CODES)[],
      ],
    )
    .optional(),
});

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(request.url);
  const result = querySchema.safeParse({ code: searchParams.get("code") });

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid query parameters" },
      { status: 400 },
    );
  }

  const { code = STATUS_CODES.AUTH_REFRESH.code } = result.data;

  logger.info(`sign-out-in/route.ts - Signing out with code: ${code}`);
  await signOut({ redirect: false }).catch((error: Error) => {
    logger.error(`sign-out-in/route.ts - Sign out error: ${error.message}`);
  });

  return routeRedirectWithCode(routes.auth.signIn, { code, request });
};
