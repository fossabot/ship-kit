import "@/styles/globals.css";

import { GeistSans as fontSans } from "geist/font/sans";
import { Noto_Serif_Display as FontSerif, Noto_Sans } from "next/font/google";

import { ErrorToast } from "@/components/primitives/error-toast";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import LogProvider from "@/plugins/LogProvider";
import { stackServerApp } from "@/stack";
import { TRPCReactProvider } from "@/trpc/react";
import { StackProvider, StackTheme } from "@stackframe/stack";
import HolyLoader from "holy-loader";
import { Suspense } from "react";

const fontSansOld = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = FontSerif({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen antialiased",
          "font-sans font-normal leading-relaxed",
          fontSans.variable,
          fontSerif.variable,
        )}
      >
        <LogProvider prefix="[LogFlare]" logLevel="info">
          <StackProvider app={stackServerApp}>
            <StackTheme>
              <TRPCReactProvider>
                <HolyLoader showSpinner />
                <TooltipProvider>
                  {children}

                  <Suspense>
                    <ErrorToast />
                  </Suspense>

                  <Toaster />
                  <SonnerToaster />
                </TooltipProvider>
              </TRPCReactProvider>
            </StackTheme>
          </StackProvider>
        </LogProvider>
      </body>
    </html>
  );
}
