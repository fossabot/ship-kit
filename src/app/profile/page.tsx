"use client";

import { UserButton, useStackApp, useUser } from "@stackframe/stack";
import Link from "next/link";

const ProfilePage = () => {
  const user = useUser({ or: "redirect" });
  const stackApp = useStackApp();

  if (!user) return null; // Prevent rendering while redirecting

  return (
    <div>
      <UserButton />
      <p>Welcome, {user.displayName ?? "anonymous user"}</p>
      <p>Your e-mail: {user.primaryEmail}</p>
      <Link href={stackApp.urls.signOut}>Sign Out</Link>
    </div>
  );
};

export default ProfilePage;
