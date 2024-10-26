import { type UserRole } from "@/types/user";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string;
      emailVerified: Date | null;
      image: string | null;
      role?: UserRole; // Add custom properties here
    };
  }

  interface User {
    id: string;
    name: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
    password?: string; // Add the password field if necessary
    role?: UserRole; // Add custom properties here
  }
}
