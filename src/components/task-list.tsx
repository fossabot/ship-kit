"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// Component to display the list of tasks
export const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    // Fetch tasks when the component mounts and session is available
    const fetchTasks = async () => {
      if (session) {
        try {
          const response = await fetch("/api/tasks");
          if (!response.ok) {
            throw new Error("Failed to fetch tasks");
          }
          const todaysTasks = await response.json();
          setTasks(todaysTasks);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      }
    };
    fetchTasks();
  }, [session]);

  if (!session) {
    return <div>Please log in to view your tasks.</div>;
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li key={task.id} className="rounded bg-gray-100 p-2">
          {task.summary}
        </li>
      ))}
    </ul>
  );
};
