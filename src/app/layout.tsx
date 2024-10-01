import "@/styles/globals.css";

import { type Metadata } from "next";

import RootLayout from "@/components/layouts/root-layout";

export const metadata: Metadata = {
  title: "Flag Spam API",
  description: "Flag Spam API",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default RootLayout;
