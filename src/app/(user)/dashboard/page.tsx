"use client";

import { UserGreeting } from "@/app/_components/UserGreeting";
import { TaskList } from "@/components/task-list";
import { useUser } from "@stackframe/stack";

// Dashboard page component
const DashboardPage = () => {
  const user = useUser({ or: "redirect" });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">
        Today is {new Date().toLocaleDateString()}
      </h1>
      <UserGreeting />
      <TaskList />
    </div>
  );
};

export default DashboardPage;
