"use client";

import { UserButton, useUser } from "@stackframe/stack";
import Link from "next/link";

const ProfilePage = () => {
  const user = useUser({ or: "redirect" });

  if (!user) return null; // Prevent rendering while redirecting

  return (
    <div>
      <UserButton />
      <p>Welcome, {user.displayName ?? "anonymous user"}</p>
      <p>Your e-mail: {user.primaryEmail}</p>
      <p>
        <Link href="/api/auth/signout">Sign Out</Link>
      </p>
    </div>
  );
};

export default ProfilePage;
