"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signOutAction } from "@/server/actions/auth";
import { motion } from "framer-motion";
import { HandIcon, LogOutIcon } from "lucide-react";
import { useState } from "react";

export function SignOutCard() {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOutAction();
    setIsSigningOut(false);
  };

  return (
    <Card className="w-[400px] overflow-hidden">
      <div className="flex">
        <div className="flex w-1/2 items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 p-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <HandIcon className="h-20 w-20 text-white" />
          </motion.div>
        </div>
        <div className="w-1/2">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Farewell!</CardTitle>
            <CardDescription className="text-center">
              Ready to sign out?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm text-muted-foreground">
              We hope to see you again soon!
            </p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => void handleSignOut()}
              className="w-full transform bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 hover:scale-105 hover:from-purple-600 hover:to-pink-600"
              disabled={isSigningOut}
            >
              {isSigningOut ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <LogOutIcon className="mr-2 h-4 w-4" />
                </motion.div>
              ) : (
                <LogOutIcon className="mr-2 h-4 w-4" />
              )}
              {isSigningOut ? "Signing Out..." : "Sign Out"}
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
