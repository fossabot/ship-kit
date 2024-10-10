"use client";

import { LiveLogs } from "@/app/(main)/_components/live-logs";
import { SidebarLayout, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/views/app-sidebar";
import { UserButton, useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DashboardPage = () => {
  const router = useRouter();
  const user = useUser({ or: "redirect" });

  useEffect(() => {
    // Redirect to home page if user is not logged in
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  if (!user) return null; // Prevent rendering while redirecting

  return (
    <SidebarLayout defaultOpen={true}>
      <AppSidebar />
      <main className="flex flex-1 flex-col p-4 transition-all duration-300 ease-in-out">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Your Dashboard</h1>
          <UserButton />
        </div>
        <p className="mb-4">Welcome, {user.displayName ?? "anonymous user"}</p>
        <div className="rounded-md border-2 border-dashed p-4">
          <LiveLogs />
        </div>
        <SidebarTrigger />
      </main>
    </SidebarLayout>
  );
};

export default DashboardPage;
