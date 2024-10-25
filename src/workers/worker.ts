/// <reference lib="webworker" />

/**
 * Worker Example
 * This is a simple worker that listens for messages and logs them.
 */

self.addEventListener("message", (event: MessageEvent) => {
  console.log("Worker received message:", event);
});
