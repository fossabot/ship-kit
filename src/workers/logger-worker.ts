/// <reference lib="webworker" />

/**
 * Logger Worker
 * This worker handles logging operations in batches to reduce API calls.
 */

import { type LogData } from "@/types/logger";

const logQueue: LogData[] = [];
const MAX_BATCH_SIZE = 10;
const FLUSH_INTERVAL = 5000; // 5 seconds

const flushLogs = (): void => {
  if (logQueue.length === 0) {
    return;
  }

  const logsToSend = logQueue.splice(0, MAX_BATCH_SIZE);
  fetch(`/api/logger`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(logsToSend),
  })
    .then(async (response) => {
      console.log("Logs sent:", response.statusText, response);
    })
    .catch((error: Error) => console.error("Error sending logs:", error));
  console.log("Flushed logs:", logsToSend);
};

setInterval(flushLogs, FLUSH_INTERVAL);

self.addEventListener("message", (event: MessageEvent) => {
  const { logData } = event.data as { logData: LogData };
  logQueue.push(logData);

  if (logQueue.length >= MAX_BATCH_SIZE) {
    flushLogs();
  }
});
