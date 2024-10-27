"use server";

import { routes } from "@/config/routes";
import { SEARCH_PARAM_KEYS } from "@/config/search-param-keys";
import { STATUS_CODES } from "@/config/status-codes";
import { logger } from "@/lib/logger";
import { validatedAction } from "@/lib/utils/middleware";
import { forgotPasswordSchema, signInActionSchema } from "@/schemas/auth";
import { userApplySchema } from "@/schemas/user";
import { signIn, signOut } from "@/server/auth";
import "server-only";
import { createServerAction } from "zsa";

export const signInWithOAuthAction = async ({
  providerId,
  options,
}: {
  providerId: string;
  options?: any;
}) => {
  await signIn(providerId, {
    redirectTo: options?.redirectTo ?? routes.home,
    ...options,
  });
  return { success: STATUS_CODES.LOGIN.message };
};

export const signInAction = createServerAction()
  .input(signInActionSchema)
  .handler(async ({ input }) => {
    const response = await signIn("credentials", {
      redirect: input.redirect ?? true,
      redirectTo: input.redirectTo ?? routes.home,
      email: input.email,
      password: input.password,
    }).catch((error) => {
      logger.error(error);
      return { error: STATUS_CODES.UNKNOWN.message };
    });
    return null;
  });

// Todo: redirect back to the page the user was on before signing out
export const signOutAction = async (options?: any) => {
  await signOut({
    redirectTo: `${routes.home}?${SEARCH_PARAM_KEYS.statusCode}=${STATUS_CODES.LOGOUT.code}`,
    redirect: true,
    ...options,
  });
  return { success: STATUS_CODES.LOGOUT.message };
};

// Todo: Implement forgot password
export const forgotPasswordAction = createServerAction()
  .input(forgotPasswordSchema)
  .handler(async ({ input }) => {
    // return await forgotPassword(input);
  });

export const signUpAction = validatedAction(
  userApplySchema,
  async (data: any, formData: FormData) => {
    console.log(formData);
    console.log(formData.get("address_object"));
    const email = formData.get("email") as string;
    const acceptTerms = formData.get("acceptTerms") === "on";

    // Parse the location JSON back into an object
    const addressJson = formData.get("address_object") as string;
    const address = JSON.parse(addressJson);

    const payload = {
      email,
      address,
      acceptTerms,
    };

    return await Promise.resolve(() => {
      console.log(payload);
    });
  },
);
