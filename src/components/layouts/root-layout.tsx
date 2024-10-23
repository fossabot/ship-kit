import "@/styles/globals.css";

import { GeistSans as fontSans } from "geist/font/sans";
import { Noto_Serif_Display as FontSerif, Noto_Sans } from "next/font/google";

import { Analytics } from "@/components/primitives/analytics";
import { ErrorToast } from "@/components/primitives/error-toast";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TRPCReactProvider } from "@/trpc/react";
import HolyLoader from "holy-loader";
import { ThemeProvider } from "next-themes";
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
        <HolyLoader showSpinner />

        <ThemeProvider attribute="class">
          <TRPCReactProvider>
            <TooltipProvider>
              {children}

              <Suspense>
                <ErrorToast />
              </Suspense>

              <Analytics />

              <Toaster />
              <SonnerToaster />
            </TooltipProvider>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
