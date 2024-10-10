// @ts-check

import { withLogFlare } from "./src/lib/withLogFlare.js";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  devIndicators: {
    buildActivityPosition: 'bottom-left',
  },
    experimental: {
    // typedRoutes: true,
      webVitalsAttribution: ['CLS', 'LCP']
  },

  compiler: {
    // Remove all console logs
    // removeConsole: true
        // Remove console logs only in production, excluding error logs
    // removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false
  }};

/** @type {import("./src/lib/withLogFlare.js").LogFlareOptions} */
const logFlareOptions = {
  apiKey: 'ocUREAapXQTYL0rbS28hse5a7yl2nwam', // Move to env
  prefix: '[LogFlare]',
  logLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  logToFile: true,
  logFilePath: './logflare.log',
  useColors: true,
  useEmoji: true,
  colors: {
    // Override default colors if needed
    error: '\x1b[41m\x1b[37m', // White text on red background
  },
  emojis: {
    // Override default emojis if needed
    debug: '🔍',
  },
};

export default withLogFlare(logFlareOptions)(config);
