"use client";

import { LatestPost } from "@/app/_components/post";
import { UserGreeting } from "@/app/_components/UserGreeting";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import logger from '@/utils/logger';
import { useStackApp, useUser } from "@stackframe/stack";
import Link from "next/link";

const HomePage = () => {
  const user = useUser();
  const stackApp = useStackApp();

  logger.info('Rendering HomePage');

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-4 text-3xl font-bold">Welcome to Task Manager</h1>
        <UserGreeting />
        <LatestPost />
        <p className="mb-4">Please sign in to manage your tasks</p>
        {user ? (
          <Link href={routes.tasks} className={buttonVariants()}>
            Proceed to Dashboard
          </Link>
        ) : (
          <Link href={stackApp.urls.signIn} className={buttonVariants()}>
            Sign in
          </Link>
        )}
      </div>
    </>
  );
};

export default HomePage;
