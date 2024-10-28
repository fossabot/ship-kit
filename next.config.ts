/**
 *
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import { FILE_UPLOAD_MAX_SIZE } from "@/config/file";
import BuilderDevTools from "@builder.io/dev-tools/next";
import { redirects } from "@/config/routes";

/** @type {import("next").NextConfig} */
const config = BuilderDevTools()({
  /*
   * React configuration
   */
  reactStrictMode: true,
  /*
   * Redirects are located in the `src/config/routes.ts` file
   */
  redirects,
  /*
   * Next.js configuration
   */
  images: {
    remotePatterns: [
      { hostname: "picsum.photos" }, // @dev: for testing
      { hostname: "avatar.vercel.sh" }, // @dev: for testing
      { hostname: "github.com" }, // @dev: for testing
      { hostname: "images.unsplash.com" }, // @dev: for testing
    ],
  },
  /*
   * Lint configuration
   */
  eslint: {
    /*
             !! WARNING !!
             * This allows production builds to successfully complete even if
             * your project has ESLint errors.
             */
    ignoreDuringBuilds: true,
  },
  typescript: {
    /*
             !! WARNING !!
             * Dangerously allow production builds to successfully complete even if
             * your project has type errors.
             */
    ignoreBuildErrors: true,
  },
  /*
   * Logging configuration
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/logging
   */
  logging: {
    fetches: {
      fullUrl: true, // This will log the full URL of the fetch request even if cached
      // hmrRefreshes: true,
    },
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
  /*
   * Miscellaneous configuration
   */
  devIndicators: {
    buildActivityPosition: "bottom-left",
  },
  // @see https://nextjs.org/docs/app/api-reference/next-config-js/bundlePagesRouterDependencies
  bundlePagesRouterDependencies: true,
  compiler: {
    // Remove all console logs
    // removeConsole: true
    // Remove console logs only in production, excluding error logs
    // removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false
  },
});

export default config;
