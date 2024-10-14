import "@/styles/globals.css";

import { type Metadata } from "next";

import RootLayout from "@/components/layouts/root-layout";

export const metadata: Metadata = {
  title: "LogFlare",
  description: "Illuminate your logs, ignite your insights",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default RootLayout;
