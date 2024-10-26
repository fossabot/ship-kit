import "@/styles/globals.css";

import { GeistSans as fontSans } from "geist/font/sans";
import { Noto_Serif_Display as FontSerif } from "next/font/google";

import { Analytics } from "@/components/primitives/analytics";
import { ErrorToast } from "@/components/primitives/error-toast";
import { WebVitals } from "@/components/primitives/web-vitals";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TRPCReactProvider } from "@/trpc/react";
import HolyLoader from "holy-loader";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen antialiased",
          "font-sans font-normal leading-relaxed",
          fontSans.variable,
          fontSerif.variable,
        )}
      >
        <HolyLoader showSpinner />

        <TRPCReactProvider>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <TooltipProvider defaultOpenDelay={100}>
              {children}

              {/* Metrics */}
              <Analytics />
              <WebVitals />

              {/* Toasts */}
              <Toaster />
              <SonnerToaster />
              <Suspense>
                <ErrorToast />
              </Suspense>
            </TooltipProvider>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
