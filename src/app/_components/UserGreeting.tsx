"use client";

import { useUser } from "@stackframe/stack";

export const UserGreeting = () => {
  const user = useUser();

  return (
    <div>
      {user ? `Hello, ${user.displayName ?? "anon"}` : "You are not logged in"}
    </div>
  );
};
