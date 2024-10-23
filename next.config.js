/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import { FILE_UPLOAD_MAX_SIZE } from "./src/config/file.js";
import { redirects } from "./src/config/routes.js";
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  devIndicators: {
    buildActivityPosition: "bottom-left",
  },
  /*
   * Redirects are located in the `src/config/routes.js` file
   */
  redirects,

  /*
   * Next.js configuration
   */
  images: {
    remotePatterns: [
      { hostname: "picsum.photos" }, // for testing
    ],
  },
  // @see https://nextjs.org/docs/app/api-reference/next-config-js/logging
  logging: {
    fetches: {
      fullUrl: true, // This will log the full URL of the fetch request even if cached
      // hmrRefreshes: true,
    },
  },

  /*
   * Lint configuration
   */
  eslint: {
    // !! WARN !!
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    // ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // ignoreBuildErrors: true,
  },

  /*
   * Experimental configuration
   */
  experimental: {
    serverActions: {
      bodySizeLimit: FILE_UPLOAD_MAX_SIZE,
    },
    nextScriptWorkers: true, // Web workers @see https://nextjs.org/docs/app/building-your-application/optimizing/scripts#inline-scripts
    // ppr: true, // Partial Prerendering
    // typedRoutes: true,
    // webVitalsAttribution: ["CLS", "LCP"],
  },

  compiler: {
    // Remove all console logs
    // removeConsole: true
    // Remove console logs only in production, excluding error logs
    // removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false
  },
};

export default config;
