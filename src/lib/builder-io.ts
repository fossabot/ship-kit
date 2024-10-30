/*
 * This file is used to initialize the Builder SDK
 * @see https://www.builder.io/c/docs/sdk-setup
 *
 * @returns builder
 *
 * @example
 * const builder = builderInit();
 */

import { env } from "@/env";
import { builder } from "@builder.io/sdk";

// Replace with your Public API Key
export const builderInit = () => {
  if (!env.NEXT_PUBLIC_BUILDER_API_KEY) {
    return null;
  }
  builder.init(env.NEXT_PUBLIC_BUILDER_API_KEY);
  return builder;
};
