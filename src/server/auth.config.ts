import { routes } from "@/config/routes";
import type { NextAuthConfig } from "next-auth";
import Discord from "next-auth/providers/discord";
import GitHub from "next-auth/providers/github";

const providers: NextAuthConfig["providers"] = [
  Discord,
  GitHub,
  // CredentialsProvider({
  //   name: "Credentials",
  //   credentials: {
  //     email: { label: "Email", type: "email" },
  //     password: { label: "Password", type: "password" },
  //   },
  //   async authorize(credentials) {
  //     if (
  //       typeof credentials.email !== "string" ||
  //       typeof credentials.password !== "string"
  //     ) {
  //       return null;
  //     }

  //     // Implement your logic to verify the user's credentials
  //     const user = await verifyUser(credentials.email, credentials.password);
  //     if (user) {
  //       return user;
  //     } else {
  //       return null;
  //     }
  //   },
  // }),
];

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider as () => { id: string; name: string };
    return providerData();
  } else if ("type" in provider && provider.type === "credentials") {
    return { id: provider.id, name: provider.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthConfig = {
  debug: process.env.NODE_ENV !== "production",
  providers,
  pages: {
    /*
     * Custom Login Page
     * @see https://authjs.dev/guides/pages/signin
     */
    signIn: routes.auth.signIn,
    signOut: routes.auth.signOut,

    /*
     * Custom Error Page
     * @see https://authjs.dev/guides/pages
     */
    error: routes.auth.error,
  },

  /*
      Extending the Session
      @see https://authjs.dev/guides/extending-the-session
  */
  // callbacks: {},
} satisfies NextAuthConfig;
