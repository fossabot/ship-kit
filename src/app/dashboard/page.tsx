"use client";

import { TaskList } from "@/components/task-list";
import { SessionProvider } from "next-auth/react";

// Dashboard page component
const DashboardPage = () => (
  <SessionProvider>
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Your Tasks for Today</h1>
      <TaskList />
    </div>
  </SessionProvider>
);

export default DashboardPage;
