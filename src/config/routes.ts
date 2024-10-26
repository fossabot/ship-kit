import { type Route } from "next";

interface RouteObject {
  path: string;
  params?: Record<string, any>;
}

export const createRoute = (
  path: string,
  params: Record<string, any> = {},
): RouteObject => ({ path, params });

export const routes = {
  home: "/",
  buy: "/buy",
  docs: "/docs",
  tasks: "/tasks",

  auth: {
    signIn: "/sign-in",
    signUp: "/sign-up",
    signOut: "/sign-out",
    forgotPassword: "/forgot-password",
    signInPage: "/api/auth/signin",
    signOutPage: "/api/auth/signout",
    signOutIn: "/sign-out-in",
    error: "/error",
  },

  app: {
    dashboard: "/app",
    apiKeys: "/api-keys",
    logs: "/logs",
    network: "/network",
    live: "/live",
    settings: "/settings",
  },

  api: {
    apiKeys: "/api/api-keys",
    apiKey: createRoute("/api/api-keys/:key", { key: null }),

    logs: "/api/logs",
    live: "/api/live-logs",
    sse: "/api/sse-logs",
    sendTestLog: "/api/send-test-log",
  },

  workers: {
    logger: "/workers/workers/logger-worker.js",
  },

  demo: {
    network: "/demo/network",
  },

  external: {
    website: "https://lacymorrow.com",
    // Social
    email: "mailto:me@lacymorrow.com",
    github: "https://github.com/lacymorrow/ship-kit",
    x: "https://x.com/intent/follow?screen_name=lacybuilds",
    x_follow: "https://x.com/intent/follow?screen_name=lacybuilds",
  },

  todo: "/",
} as const;

interface Redirect {
  source: string;
  destination: string;
  permanent: boolean;
}

export const redirects = (): Redirect[] => {
  return [
    ...createRedirects(["/join", "/signup"], routes.auth.signUp),
    ...createRedirects(["/login", "/log-in", "/signin"], routes.auth.signIn),
    ...createRedirects(
      ["/logout", "/log-out", "/signout"],
      routes.auth.signOut,
    ),
  ];
};

export const createRedirects = (
  sources: string[],
  destination: string,
  permanent = false,
): Redirect[] => {
  return sources.map((source) => ({
    source,
    destination,
    permanent,
  }));
};

export const getRoutePath = (
  route: string | RouteObject,
  params: Record<string, any> = {},
): Route => {
  if (typeof route === "string") {
    return route;
  }

  let path = route.path;
  Object.entries(route.params ?? {}).forEach(([key, defaultValue]) => {
    const value = Object.prototype.hasOwnProperty.call(params, key)
      ? params[key]
      : defaultValue;
    if (value !== null) {
      path = path.replace(`:${key}`, value);
    }
  });
  return path;
};

export const rx = (path: string, params: Record<string, any> = {}): Route => {
  const parts = path.split(".");
  let current: any = routes;

  for (const part of parts) {
    if (current[part] === undefined) {
      throw new Error(`Route not found: ${path}`);
    }
    current = current[part];
  }

  if (typeof current === "object" && "index" in current) {
    return getRoutePath(current.index, params);
  }

  return getRoutePath(current, params);
};
