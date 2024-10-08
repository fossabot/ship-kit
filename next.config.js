// @ts-check

import withLogFlare from "./src/plugins/withLogFlare.js";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {};

/** @type {import("./src/plugins/withLogFlare.js").LogFlareOptions} */
const logFlareOptions = {
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
