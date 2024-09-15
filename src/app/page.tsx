"use client";

import { useStackApp, useUser } from "@stackframe/stack";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const HomePage = () => {
  const router = useRouter();
  const user = useUser();
  const stackApp = useStackApp();

  useEffect(() => {
    // Redirect to dashboard if user is logged in
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-3xl font-bold">Welcome to Task Manager</h1>
      <p className="mb-4">Please sign in to manage your tasks</p>
      <Link
        href={stackApp.urls.signIn}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Sign in with Google
      </Link>
    </div>
  );
};

export default HomePage;
