"use server";

import { isSpam, type IsSpamProps } from "@/server/api/services/is-spam";

export const isSpamAction = async (props: IsSpamProps) => {
  return await isSpam(props);
};
