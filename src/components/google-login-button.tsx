"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

// Component for Google login button
export const GoogleLoginButton = () => (
  <Button
    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
    className="w-full"
  >
    Login with Google
  </Button>
);
