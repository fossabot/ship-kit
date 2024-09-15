"use client";

import { useUser } from "@stackframe/stack";
import { useEffect, useState } from "react";

interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime: string };
  end: { dateTime: string };
}

interface Task {
  id: string;
  title: string;
  due?: string;
  status: string;
  updated: string;
}

interface TaskList {
  id: string;
  title: string;
}

interface CalendarData {
  summary: string;
  description: string;
  timeZone: string;
  items: CalendarEvent[];
}

const TaskList = () => {
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const user = useUser({ or: "redirect" });
  const account = user?.useConnectedAccount("google", {
    or: "redirect",
    scopes: [
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/tasks.readonly",
    ],
  });
  const { accessToken } = account?.useAccessToken() ?? {};

  useEffect(() => {
    if (accessToken) {
      // Get today's date in ISO format
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Fetch calendar events for today from Google Calendar API
      fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${today.toISOString()}&timeMax=${tomorrow.toISOString()}&singleEvents=true&orderBy=startTime`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      )
        .then((res) => res.json())
        .then((data: CalendarData) => {
          console.log("Calendar data:", data);
          setCalendarData(data);
        })
        .catch((err) => {
          console.error("Error fetching events:", err);
          setError("Failed to fetch calendar events. Please try again later.");
        });

      // Fetch all task lists
      fetch("https://tasks.googleapis.com/tasks/v1/users/@me/lists", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((res) => res.json())
        .then((data: { items: TaskList[] }) => {
          console.log("Task lists:", data);
          // Fetch tasks from all lists
          return Promise.all(
            data.items.map((list) =>
              fetch(
                `https://tasks.googleapis.com/tasks/v1/lists/${list.id}/tasks?showCompleted=false`,
                {
                  headers: { Authorization: `Bearer ${accessToken}` },
                },
              ).then((res) => res.json()),
            ),
          );
        })
        .then((tasksData) => {
          console.log("All tasks data:", tasksData);
          const allTasks = tasksData.flatMap((data) => data.items || []);
          setTasks(allTasks);
        })
        .catch((err) => {
          console.error("Error fetching tasks:", err);
          setError("Failed to fetch tasks. Please try again later.");
        });
    }
  }, [accessToken]);

  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString();
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Your Schedule for Today</h2>
      <h3 className="mb-2 text-lg font-medium">
        Calendar: {calendarData?.summary}
      </h3>
      <p className="mb-2 text-sm text-gray-600">
        Time Zone: {calendarData?.timeZone}
      </p>
      <p className="mb-4 text-sm text-gray-600">
        Description: {calendarData?.description}
      </p>
      {calendarData?.items.length ? (
        <ul className="mb-4">
          {calendarData.items.map((event) => (
            <li key={event.id} className="mb-2 flex items-center">
              <span className="mr-2">{formatTime(event.start.dateTime)}</span>
              <span className="mr-2">-</span>
              <span className="mr-4">{formatTime(event.end.dateTime)}</span>
              <span>{event.summary}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-4">No events scheduled for today.</p>
      )}

      <h3 className="mb-2 text-lg font-medium">Tasks</h3>
      {tasks.length ? (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="mb-2 flex flex-col">
              <span className="font-semibold">
                {task.title || "(No title)"}
              </span>
              <span className="text-sm text-gray-600">
                Status: {task.status}
              </span>
              <span className="text-sm text-gray-600">
                Due: {task.due ? formatDate(task.due) : "No due date"}
              </span>
              <span className="text-sm text-gray-600">
                Last updated: {formatDate(task.updated)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks found. You can add tasks using Google Tasks.</p>
      )}
    </div>
  );
};

export default TaskList;
