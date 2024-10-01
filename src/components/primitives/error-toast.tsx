"use client";

import { STATUS_CODES } from "@/lib/constants/status-codes";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export const ErrorToast = () => {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("code");

  useEffect(() => {
    if (errorCode && Object.keys(STATUS_CODES).includes(errorCode)) {
      const error = STATUS_CODES[errorCode as keyof typeof STATUS_CODES];

      console.log(error, toast);
      if (error) {
        // Todo: renders twice
        setTimeout(() => {
          toast.error(error.message);
        }, 1000);
      }
    }
  }, [errorCode]);

  return null;
};
